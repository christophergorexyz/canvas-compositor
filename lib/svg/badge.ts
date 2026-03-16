import Picture from '../context-2d/picture';
import { ComponentOptions } from '../context-2d/component';
import { IRenderOutput } from '../rendering/canvas-2d-renderer';
import SVGRenderer, { ISVGBadgeRenderOptions } from '../rendering/svg-renderer';

export interface SVGBadgeOptions extends ComponentOptions, ISVGBadgeRenderOptions {
  width: number;
  height: number;
}

export default class SVGBadge extends Picture {
  readonly svgRenderer: SVGRenderer;

  constructor(options: SVGBadgeOptions) {
    const svgRenderer = new SVGRenderer(options.width, options.height);
    svgRenderer.renderBadge(options);
    super(svgRenderer.fallbackCanvas, options);

    this.svgRenderer = svgRenderer;
  }

  rerender(options?: ISVGBadgeRenderOptions) {
    this.svgRenderer.renderBadge(options);
    this.invalidate();
  }

  override getRenderOutput(): IRenderOutput {
    return this.svgRenderer.getRenderOutput();
  }
}
