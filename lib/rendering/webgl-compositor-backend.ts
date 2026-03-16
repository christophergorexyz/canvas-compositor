import Component from '../context-2d/component';
import Composition from '../context-2d/composition';
import Canvas2DRenderer, { IRenderOutput } from './canvas-2d-renderer';
import CompositorBackend from './compositor-backend';
import Renderer from './renderer';

function isTexImageSource(source: unknown): source is TexImageSource {
  return source instanceof HTMLImageElement
    || source instanceof HTMLCanvasElement
    || source instanceof HTMLVideoElement
    || source instanceof ImageBitmap
    || source instanceof OffscreenCanvas
    || source instanceof VideoFrame;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('WebGL compositor shader could not be created.');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? 'Unknown WebGL compositor shader compilation error.';
    gl.deleteShader(shader);
    throw new Error(info);
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error('WebGL compositor program could not be created.');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? 'Unknown WebGL compositor program linking error.';
    gl.deleteProgram(program);
    throw new Error(info);
  }

  return program;
}

function getWebGLContext(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (!context || !('createShader' in context)) {
    throw new Error('The root WebGL rendering context could not be created.');
  }

  return context as WebGLRenderingContext;
}

function isIdentityPresentationComponent(component: Component) {
  return component.displacement[0] === 0
    && component.displacement[1] === 0
    && component.rotation === 0
    && component.scale[0] === 1
    && component.scale[1] === 1
    && component.reflect[0] === 1
    && component.reflect[1] === 1;
}

export default class WebGLCompositorBackend extends CompositorBackend {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGLRenderingContext;
  private readonly program: WebGLProgram;
  private readonly positionBuffer: WebGLBuffer;
  private readonly texCoordBuffer: WebGLBuffer;
  private readonly texture: WebGLTexture;
  private readonly positionLocation: number;
  private readonly texCoordLocation: number;
  private readonly textureLocation: WebGLUniformLocation;

  constructor(canvas: HTMLCanvasElement, componentRenderer: Renderer = new Canvas2DRenderer()) {
    super(componentRenderer);
    this.canvas = canvas;
    this.gl = getWebGLContext(canvas);
    this.program = createProgram(this.gl, `
      attribute vec2 aPosition;
      attribute vec2 aTexCoord;

      varying vec2 vTexCoord;

      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        vTexCoord = aTexCoord;
      }
    `, `
      precision mediump float;

      varying vec2 vTexCoord;
      uniform sampler2D uTexture;

      void main() {
        gl_FragColor = texture2D(uTexture, vTexCoord);
      }
    `);

    const positionBuffer = this.gl.createBuffer();
    const texCoordBuffer = this.gl.createBuffer();
    const texture = this.gl.createTexture();

    if (!positionBuffer || !texCoordBuffer || !texture) {
      throw new Error('WebGL compositor resources could not be created.');
    }

    this.positionBuffer = positionBuffer;
    this.texCoordBuffer = texCoordBuffer;
    this.texture = texture;

    const positionLocation = this.gl.getAttribLocation(this.program, 'aPosition');
    const texCoordLocation = this.gl.getAttribLocation(this.program, 'aTexCoord');
    const textureLocation = this.gl.getUniformLocation(this.program, 'uTexture');

    if (positionLocation < 0 || texCoordLocation < 0 || !textureLocation) {
      throw new Error('WebGL compositor program locations could not be resolved.');
    }

    this.positionLocation = positionLocation;
    this.texCoordLocation = texCoordLocation;
    this.textureLocation = textureLocation;
  }

  getPresentationOutput(scene: Composition): IRenderOutput {
    if (scene.children.length === 1) {
      const [child] = scene.children;
      const output = child.getRenderOutput();
      if (output.kind === 'webgl' && isIdentityPresentationComponent(child)) {
        return output;
      }
    }

    return scene.getRenderOutput();
  }

  present(output: IRenderOutput) {
    const source = output.kind === 'webgl'
      ? output.source
      : output.kind === 'svg'
        ? output.fallbackBitmap.source
        : output.source;

    if (!isTexImageSource(source)) {
      throw new Error('WebGLCompositorBackend requires a TexImageSource-compatible render output.');
    }

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      -1, 1,
      -1, -1,
      1, 1,
      1, -1,
    ]), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      0, 1,
      1, 0,
      1, 1,
    ]), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.texCoordLocation);
    this.gl.vertexAttribPointer(this.texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 0);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source);
    this.gl.uniform1i(this.textureLocation, 0);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
}
