import Canvas2DRenderer, { IBitmapRenderOutput, IRenderOutput } from './canvas-2d-renderer';
import CompositorBackend from './compositor-backend';
import Renderer from './renderer';

function asBitmapRenderOutput(output: IRenderOutput): IBitmapRenderOutput {
  if (output.kind === 'bitmap') {
    return output;
  }

  if (output.kind === 'webgl') {
    return output.fallbackBitmap;
  }

  if (output.kind === 'svg') {
    return output.fallbackBitmap;
  }

  throw new Error(`SVGCompositorBackend does not support render output kind "${String((output as { kind?: string }).kind)}".`);
}

export default class SVGCompositorBackend extends CompositorBackend {
  readonly svg: SVGSVGElement;
  private readonly rasterCanvas: HTMLCanvasElement;
  private readonly rasterContext: CanvasRenderingContext2D;
  private readonly parser: DOMParser;

  constructor(svg: SVGSVGElement, componentRenderer: Renderer = new Canvas2DRenderer()) {
    super(componentRenderer);
    this.svg = svg;
    this.rasterCanvas = document.createElement('canvas');

    const rasterContext = this.rasterCanvas.getContext('2d');
    if (!rasterContext) {
      throw new Error('CanvasRenderingContext2D could not be created for SVG compositor raster staging.');
    }

    this.rasterContext = rasterContext;
    this.parser = new DOMParser();
  }

  private setViewport(width: number, height: number) {
    this.svg.setAttribute('width', `${width}`);
    this.svg.setAttribute('height', `${height}`);
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  private clearChildren() {
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }
  }

  private rasterDataUrl(output: IRenderOutput) {
    const bitmapOutput = asBitmapRenderOutput(output);

    this.rasterCanvas.width = bitmapOutput.width;
    this.rasterCanvas.height = bitmapOutput.height;
    this.rasterContext.clearRect(0, 0, bitmapOutput.width, bitmapOutput.height);
    this.rasterContext.drawImage(bitmapOutput.source, 0, 0, bitmapOutput.width, bitmapOutput.height);

    return this.rasterCanvas.toDataURL();
  }

  private presentSVGMarkup(output: Extract<IRenderOutput, { kind: 'svg' }>) {
    const root = this.parser.parseFromString(output.markup, 'image/svg+xml').documentElement;

    this.setViewport(output.width, output.height);
    this.clearChildren();

    const viewBox = root.getAttribute('viewBox');
    if (viewBox) {
      this.svg.setAttribute('viewBox', viewBox);
    }

    for (const child of Array.from(root.childNodes)) {
      this.svg.appendChild(document.importNode(child, true));
    }
  }

  private presentRasterizedOutput(output: IRenderOutput) {
    const bitmapOutput = asBitmapRenderOutput(output);
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');

    image.setAttribute('x', '0');
    image.setAttribute('y', '0');
    image.setAttribute('width', `${bitmapOutput.width}`);
    image.setAttribute('height', `${bitmapOutput.height}`);
    image.setAttribute('preserveAspectRatio', 'none');
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.rasterDataUrl(output));

    this.setViewport(bitmapOutput.width, bitmapOutput.height);
    this.clearChildren();
    this.svg.appendChild(image);
  }

  present(output: IRenderOutput) {
    if (output.kind === 'svg') {
      this.presentSVGMarkup(output);
      return;
    }

    this.presentRasterizedOutput(output);
  }
}
