import Canvas2DRenderer, { IRenderOutput } from './canvas-2d-renderer';
import CompositorBackend from './compositor-backend';
import Renderer from './renderer';

export default class Canvas2DCompositorBackend extends CompositorBackend {
  readonly canvas: HTMLCanvasElement;
  readonly context: ImageBitmapRenderingContext;

  constructor(canvas: HTMLCanvasElement, componentRenderer: Renderer = new Canvas2DRenderer()) {
    super(componentRenderer);
    this.canvas = canvas;

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
