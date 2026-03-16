import Canvas2DRenderTarget from './canvas-2d-render-target';
import { IRenderTarget } from './canvas-2d-render-target';

export interface IDrawRenderTargetOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  pivotX?: number;
  pivotY?: number;
  reflectX?: number;
  reflectY?: number;
}

export interface IRendererBackend {
  createRenderTarget(width: number, height: number): IRenderTarget;
  drawRenderTarget(
    source: IRenderTarget,
    destination: OffscreenCanvasRenderingContext2D,
    options: IDrawRenderTargetOptions,
  ): void;
  present(target: IRenderTarget, context: ImageBitmapRenderingContext): void;
}

function normalizedReflection(value?: number) {
  return value && value < 0 ? -1 : 1;
}

export default class Canvas2DRenderer implements IRendererBackend {
  createRenderTarget(width: number, height: number): IRenderTarget {
    return new Canvas2DRenderTarget(width, height);
  }

  drawRenderTarget(
    source: IRenderTarget,
    destination: OffscreenCanvasRenderingContext2D,
    options: IDrawRenderTargetOptions,
  ) {
    const rotation = options.rotation ?? 0;
    const reflectX = normalizedReflection(options.reflectX);
    const reflectY = normalizedReflection(options.reflectY);
    const pivotX = options.pivotX ?? 0;
    const pivotY = options.pivotY ?? 0;

    if (rotation === 0 && reflectX === 1 && reflectY === 1) {
      destination.drawImage(source.getImageSource(), options.x, options.y, options.width, options.height);
      return;
    }

    destination.save();
    destination.translate(options.x + pivotX, options.y + pivotY);
    destination.rotate(rotation);
    destination.scale(reflectX, reflectY);
    destination.translate(-pivotX, -pivotY);
    destination.drawImage(source.getImageSource(), 0, 0, options.width, options.height);
    destination.restore();
  }

  present(target: IRenderTarget, context: ImageBitmapRenderingContext) {
    context.transferFromImageBitmap(target.transferToImageBitmap());
  }
}
