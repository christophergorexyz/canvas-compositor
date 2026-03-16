import Canvas2DRenderTarget from './canvas-2d-render-target';
import { IRenderTarget } from './canvas-2d-render-target';

export interface IBitmapRenderOutput {
  kind: 'bitmap';
  source: CanvasImageSource;
  width: number;
  height: number;
}

export type IRenderOutput = IBitmapRenderOutput;

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
  presentRenderOutput(output: IRenderOutput, context: ImageBitmapRenderingContext): void;
  drawRenderOutput(
    output: IRenderOutput,
    destination: OffscreenCanvasRenderingContext2D,
    options: IDrawRenderTargetOptions,
  ): void;
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

  presentRenderOutput(output: IRenderOutput, context: ImageBitmapRenderingContext) {
    if (output.kind !== 'bitmap') {
      throw new Error(`Canvas2DRenderer does not support render output kind "${String((output as { kind?: string }).kind)}".`);
    }

    if (output.source instanceof OffscreenCanvas) {
      context.transferFromImageBitmap(output.source.transferToImageBitmap());
      return;
    }

    throw new Error('Canvas2DRenderer requires bitmap outputs backed by an OffscreenCanvas for presentation.');
  }

  drawRenderOutput(
    output: IRenderOutput,
    destination: OffscreenCanvasRenderingContext2D,
    options: IDrawRenderTargetOptions,
  ) {
    if (output.kind !== 'bitmap') {
      throw new Error(`Canvas2DRenderer does not support render output kind "${String((output as { kind?: string }).kind)}".`);
    }

    const normalizedOptions = {
      ...options,
      width: options.width ?? output.width,
      height: options.height ?? output.height,
    };

    const rotation = normalizedOptions.rotation ?? 0;
    const reflectX = normalizedReflection(normalizedOptions.reflectX);
    const reflectY = normalizedReflection(normalizedOptions.reflectY);
    const pivotX = normalizedOptions.pivotX ?? 0;
    const pivotY = normalizedOptions.pivotY ?? 0;

    if (rotation === 0 && reflectX === 1 && reflectY === 1) {
      destination.drawImage(output.source, normalizedOptions.x, normalizedOptions.y, normalizedOptions.width, normalizedOptions.height);
      return;
    }

    destination.save();
    destination.translate(normalizedOptions.x + pivotX, normalizedOptions.y + pivotY);
    destination.rotate(rotation);
    destination.scale(reflectX, reflectY);
    destination.translate(-pivotX, -pivotY);
    destination.drawImage(output.source, 0, 0, normalizedOptions.width, normalizedOptions.height);
    destination.restore();
  }

  drawRenderTarget(
    source: IRenderTarget,
    destination: OffscreenCanvasRenderingContext2D,
    options: IDrawRenderTargetOptions,
  ) {
    this.drawRenderOutput({
      kind: 'bitmap',
      source: source.getImageSource(),
      width: source.width,
      height: source.height,
    }, destination, options);
  }

  present(target: IRenderTarget, context: ImageBitmapRenderingContext) {
    this.presentRenderOutput({
      kind: 'bitmap',
      source: target.getImageSource(),
      width: target.width,
      height: target.height,
    }, context);
  }
}
