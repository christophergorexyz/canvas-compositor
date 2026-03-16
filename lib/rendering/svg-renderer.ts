export interface ISVGRenderOutput {
  kind: 'svg';
  markup: string;
  width: number;
  height: number;
  fallbackBitmap: {
    kind: 'bitmap';
    source: CanvasImageSource;
    width: number;
    height: number;
  };
}

export interface ISVGBadgeRenderOptions {
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  label?: string;
}

export default class SVGRenderer {
  readonly width: number;
  readonly height: number;
  readonly fallbackCanvas: OffscreenCanvas;
  readonly fallbackContext: OffscreenCanvasRenderingContext2D;
  private _markup: string = '';

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.fallbackCanvas = new OffscreenCanvas(width, height);
    const context = this.fallbackCanvas.getContext('2d');

    if (!context) {
      throw new Error('OffscreenCanvasRenderingContext2D could not be created for SVG fallback rendering.');
    }

    this.fallbackContext = context;
  }

  renderBadge(options?: ISVGBadgeRenderOptions) {
    const label = options?.label ?? 'SVG';
    const backgroundColor = options?.backgroundColor ?? '#f8fafc';
    const accentColor = options?.accentColor ?? '#0ea5e9';
    const textColor = options?.textColor ?? '#0f172a';

    this._markup = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
        <rect x="3" y="3" width="${this.width - 6}" height="${this.height - 6}" rx="18" fill="${backgroundColor}" stroke="${accentColor}" stroke-width="6" />
        <circle cx="${Math.round(this.width * 0.2)}" cy="${Math.round(this.height * 0.5)}" r="${Math.round(Math.min(this.width, this.height) * 0.16)}" fill="${accentColor}" />
        <text x="${Math.round(this.width * 0.38)}" y="${Math.round(this.height * 0.58)}" fill="${textColor}" font-family="sans-serif" font-size="${Math.round(this.height * 0.24)}" font-weight="700">${label}</text>
      </svg>
    `.trim();

    this.fallbackContext.clearRect(0, 0, this.width, this.height);
    this.fallbackContext.fillStyle = backgroundColor;
    this.fallbackContext.strokeStyle = accentColor;
    this.fallbackContext.lineWidth = 6;
    this.fallbackContext.beginPath();
    this.fallbackContext.roundRect(3, 3, this.width - 6, this.height - 6, 18);
    this.fallbackContext.fill();
    this.fallbackContext.stroke();
    this.fallbackContext.fillStyle = accentColor;
    this.fallbackContext.beginPath();
    this.fallbackContext.arc(Math.round(this.width * 0.2), Math.round(this.height * 0.5), Math.round(Math.min(this.width, this.height) * 0.16), 0, Math.PI * 2);
    this.fallbackContext.fill();
    this.fallbackContext.fillStyle = textColor;
    this.fallbackContext.font = `700 ${Math.round(this.height * 0.24)}px sans-serif`;
    this.fallbackContext.textBaseline = 'middle';
    this.fallbackContext.fillText(label, Math.round(this.width * 0.38), Math.round(this.height * 0.56));
  }

  getRenderOutput(): ISVGRenderOutput {
    return {
      kind: 'svg',
      markup: this._markup,
      width: this.width,
      height: this.height,
      fallbackBitmap: {
        kind: 'bitmap',
        source: this.fallbackCanvas,
        width: this.width,
        height: this.height,
      },
    };
  }
}
