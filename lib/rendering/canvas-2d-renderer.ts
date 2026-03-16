import Canvas2DRenderTarget, { IRenderTarget } from './canvas-2d-render-target';
import Renderer from './renderer';
import { IWebGLRenderOutput } from './webgl-renderer';

export interface IBitmapRenderOutput {
  kind: 'bitmap';
  source: CanvasImageSource;
  width: number;
  height: number;
}

export type IRenderOutput = IBitmapRenderOutput | IWebGLRenderOutput;

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

function normalizedReflection(value?: number) {
  return value && value < 0 ? -1 : 1;
}

function asBitmapRenderOutput(output: IRenderOutput): IBitmapRenderOutput {
  if (output.kind === 'bitmap') {
    return output;
  }

  if (output.kind === 'webgl') {
    return output.fallbackBitmap;
  }

  throw new Error(`Canvas2DRenderer does not support render output kind "${String((output as { kind?: string }).kind)}".`);
}

export default class Canvas2DRenderer extends Renderer {
  createRenderTarget(width: number, height: number): IRenderTarget {
    return new Canvas2DRenderTarget(width, height);
  }

  presentRenderOutput(output: IRenderOutput, context: ImageBitmapRenderingContext) {
    const bitmapOutput = asBitmapRenderOutput(output);

    if (bitmapOutput.source instanceof OffscreenCanvas) {
      context.transferFromImageBitmap(bitmapOutput.source.transferToImageBitmap());
      return;
    }

    throw new Error('Canvas2DRenderer requires bitmap outputs backed by an OffscreenCanvas for presentation.');
  }

  drawRenderOutput(
    output: IRenderOutput,
    destination: OffscreenCanvasRenderingContext2D,
    options: IDrawRenderTargetOptions,
  ) {
    const bitmapOutput = asBitmapRenderOutput(output);

    const normalizedOptions = {
      ...options,
      width: options.width ?? bitmapOutput.width,
      height: options.height ?? bitmapOutput.height,
    };

    const rotation = normalizedOptions.rotation ?? 0;
    const reflectX = normalizedReflection(normalizedOptions.reflectX);
    const reflectY = normalizedReflection(normalizedOptions.reflectY);
    const pivotX = normalizedOptions.pivotX ?? 0;
    const pivotY = normalizedOptions.pivotY ?? 0;

    if (rotation === 0 && reflectX === 1 && reflectY === 1) {
      destination.drawImage(bitmapOutput.source, normalizedOptions.x, normalizedOptions.y, normalizedOptions.width, normalizedOptions.height);
      return;
    }

    destination.save();
    destination.translate(normalizedOptions.x + pivotX, normalizedOptions.y + pivotY);
    destination.rotate(rotation);
    destination.scale(reflectX, reflectY);
    destination.translate(-pivotX, -pivotY);
    destination.drawImage(bitmapOutput.source, 0, 0, normalizedOptions.width, normalizedOptions.height);
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
