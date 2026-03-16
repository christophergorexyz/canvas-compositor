import Picture from '../context-2d/picture';
import { ComponentOptions } from '../context-2d/component';
import WebGLRenderer, { IWebGLTriangleRenderOptions } from '../rendering/webgl-renderer';

type WebGLSurface = OffscreenCanvas;

export interface WebGLTriangleOptions extends ComponentOptions, IWebGLTriangleRenderOptions {
  width: number;
  height: number;
}

export default class WebGLTriangle extends Picture {
  readonly surface: WebGLSurface;
  readonly webglRenderer: WebGLRenderer;

  constructor(options: WebGLTriangleOptions) {
    const surface = new OffscreenCanvas(options.width, options.height);
    const webglRenderer = new WebGLRenderer(surface);

    webglRenderer.renderTriangle(options);
    super(surface, options);

    this.surface = surface;
    this.webglRenderer = webglRenderer;
  }

  rerender(options?: IWebGLTriangleRenderOptions) {
    this.webglRenderer.renderTriangle(options);
    this.invalidate();
  }
}
