type WebGLSurface = HTMLCanvasElement | OffscreenCanvas;

export interface IWebGLTriangleRenderOptions {
  clearColor?: [number, number, number, number];
  triangleColor?: [number, number, number, number];
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('WebGL shader could not be created.');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? 'Unknown WebGL shader compilation error.';
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
    throw new Error('WebGL program could not be created.');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? 'Unknown WebGL program linking error.';
    gl.deleteProgram(program);
    throw new Error(info);
  }

  return program;
}

function getWebGLContext(surface: WebGLSurface): WebGLRenderingContext {
  const context = surface.getContext('webgl', { alpha: true, antialias: true });

  if (!context || !('createShader' in context)) {
    throw new Error('WebGLRenderingContext could not be created.');
  }

  return context as WebGLRenderingContext;
}

export default class WebGLRenderer {
  readonly surface: WebGLSurface;
  readonly gl: WebGLRenderingContext;
  private readonly program: WebGLProgram;
  private readonly positionBuffer: WebGLBuffer;
  private readonly positionLocation: number;
  private readonly colorLocation: WebGLUniformLocation;

  constructor(surface: WebGLSurface) {
    this.surface = surface;
    this.gl = getWebGLContext(surface);
    this.program = createProgram(this.gl, `
      attribute vec2 aPosition;

      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `, `
      precision mediump float;

      uniform vec4 uColor;

      void main() {
        gl_FragColor = uColor;
      }
    `);

    const positionBuffer = this.gl.createBuffer();
    if (!positionBuffer) {
      throw new Error('WebGL position buffer could not be created.');
    }

    this.positionBuffer = positionBuffer;

    const positionLocation = this.gl.getAttribLocation(this.program, 'aPosition');
    if (positionLocation < 0) {
      throw new Error('WebGL attribute location "aPosition" could not be resolved.');
    }

    const colorLocation = this.gl.getUniformLocation(this.program, 'uColor');
    if (!colorLocation) {
      throw new Error('WebGL uniform location "uColor" could not be resolved.');
    }

    this.positionLocation = positionLocation;
    this.colorLocation = colorLocation;
  }

  renderTriangle(options?: IWebGLTriangleRenderOptions) {
    const clearColor = options?.clearColor ?? [0, 0, 0, 0];
    const triangleColor = options?.triangleColor ?? [0.125, 0.725, 0.505, 1];
    const vertices = new Float32Array([
      0, 0.8,
      -0.8, -0.8,
      0.8, -0.8,
    ]);

    this.gl.viewport(0, 0, this.surface.width, this.surface.height);
    this.gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform4fv(this.colorLocation, triangleColor);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}
