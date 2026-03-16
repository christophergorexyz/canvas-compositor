import { IRenderTarget } from './canvas-2d-render-target';
import { IDrawRenderTargetOptions, IRenderOutput } from './canvas-2d-renderer';

export default abstract class Renderer {
  abstract createRenderTarget(width: number, height: number): IRenderTarget;
  abstract presentRenderOutput(output: IRenderOutput, context: ImageBitmapRenderingContext): void;
  abstract drawRenderOutput(
    output: IRenderOutput,
    destination: OffscreenCanvasRenderingContext2D,
    options: IDrawRenderTargetOptions,
  ): void;

  abstract drawRenderTarget(
    source: IRenderTarget,
    destination: OffscreenCanvasRenderingContext2D,
    options: IDrawRenderTargetOptions,
  ): void;

  abstract present(target: IRenderTarget, context: ImageBitmapRenderingContext): void;
}
