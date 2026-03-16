export interface IRenderTarget {
  width: number;
  height: number;
  readonly context: OffscreenCanvasRenderingContext2D;
  resize(width: number, height: number): void;
  clear(): void;
  getImageSource(): CanvasImageSource;
  transferToImageBitmap(): ImageBitmap;
}

export default class Canvas2DRenderTarget implements IRenderTarget {
  private readonly canvas: OffscreenCanvas;
  readonly context: OffscreenCanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.canvas = new OffscreenCanvas(width, height);
    const context = this.canvas.getContext('2d');

    if (!context) {
      throw new Error('OffscreenCanvasRenderingContext2D could not be created.');
    }

    this.context = context;
  }

  get width() {
    return this.canvas.width;
  }

  set width(value: number) {
    this.canvas.width = value;
  }

  get height() {
    return this.canvas.height;
  }

  set height(value: number) {
    this.canvas.height = value;
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  getImageSource() {
    return this.canvas;
  }

  transferToImageBitmap() {
    return this.canvas.transferToImageBitmap();
  }
}
