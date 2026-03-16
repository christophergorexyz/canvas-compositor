import Canvas2DRenderer, { IRenderOutput, IRendererBackend } from './canvas-2d-renderer';

export interface ICompositorBackend {
  readonly componentRenderer: IRendererBackend;
  present(output: IRenderOutput): void;
}

export default class Canvas2DCompositorBackend implements ICompositorBackend {
  readonly canvas: HTMLCanvasElement;
  readonly context: ImageBitmapRenderingContext;
  readonly componentRenderer: IRendererBackend;

  constructor(canvas: HTMLCanvasElement, componentRenderer: IRendererBackend = new Canvas2DRenderer()) {
    this.canvas = canvas;
    this.componentRenderer = componentRenderer;

    const context = this.canvas.getContext('bitmaprenderer', { alpha: false, desynchronized: true });
    if (!context) {
      throw new Error('The root rendering context could not be created.');
    }

    this.context = context as ImageBitmapRenderingContext;
  }

  present(output: IRenderOutput) {
    this.componentRenderer.presentRenderOutput(output, this.context);
  }
}
