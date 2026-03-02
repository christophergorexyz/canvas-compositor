import Component from '../context-2d/component';
import { forwardTransformPoint } from '../context-2d/transform-utils';

type BoundsMode = 'logical' | 'raster';

interface WithContentOffset {
  contentOffset?: [number, number] | number[];
}

export interface DebugOverlayOptions {
  getSelectedComponent?: () => Component | null;
  logicalColor?: string;
  rasterColor?: string;
  selectedColor?: string;
}

export interface DebugOverlayRenderOptions {
  drawLogicalBounds?: boolean;
  drawRasterBounds?: boolean;
  drawSelectedBounds?: boolean;
}

export default class DebugOverlay {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly root: Component;
  private readonly getSelectedComponent: () => Component | null;
  private readonly logicalColor: string;
  private readonly rasterColor: string;
  private readonly selectedColor: string;

  constructor(canvas: HTMLCanvasElement, root: Component, options?: DebugOverlayOptions) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('CanvasRenderingContext2D could not be created for DebugOverlay');
    }

    this.canvas = canvas;
    this.context = context;
    this.root = root;
    this.getSelectedComponent = options?.getSelectedComponent ?? (() => null);
    this.logicalColor = options?.logicalColor ?? '#ef4444';
    this.rasterColor = options?.rasterColor ?? '#f59e0b';
    this.selectedColor = options?.selectedColor ?? '#22c55e';
  }

  render(referenceCanvas: HTMLCanvasElement, options?: DebugOverlayRenderOptions) {
    if (this.canvas.width !== referenceCanvas.width) {
      this.canvas.width = referenceCanvas.width;
    }

    if (this.canvas.height !== referenceCanvas.height) {
      this.canvas.height = referenceCanvas.height;
    }

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (options?.drawRasterBounds) {
      this.context.save();
      this.context.strokeStyle = this.rasterColor;
      this.context.lineWidth = 1;
      this.drawComponentBounds(this.root, 0, 0, 'raster', (_component, quad) => this.drawQuad(quad));
      this.context.restore();
    }

    if (options?.drawLogicalBounds) {
      this.context.save();
      this.context.strokeStyle = this.logicalColor;
      this.context.lineWidth = 1;
      this.drawComponentBounds(this.root, 0, 0, 'logical', (_component, quad) => this.drawQuad(quad));
      this.context.restore();
    }

    if (options?.drawSelectedBounds) {
      const selected = this.getSelectedComponent();
      if (selected) {
        this.context.save();
        this.context.strokeStyle = this.selectedColor;
        this.context.lineWidth = 2;
        this.drawComponentBounds(this.root, 0, 0, 'logical', (component, quad) => {
          if (component === selected) {
            this.drawQuad(quad);
          }
        });
        this.context.restore();
      }
    }
  }

  private drawComponentBounds(component: Component, boxX: number, boxY: number, mode: BoundsMode, drawFn: (component: Component, quad: { x: number; y: number }[]) => void) {
    const quad = this.getBoundsQuad(component, boxX, boxY, mode);
    drawFn(component, quad);

    if (!component.children.length) {
      return;
    }

    const maybeParent = component as Component & WithContentOffset;
    const parentOffsetX = maybeParent.contentOffset?.[0] ?? 0;
    const parentOffsetY = maybeParent.contentOffset?.[1] ?? 0;

    for (const child of component.children) {
      const maybeChild = child as Component & WithContentOffset;
      const childOffsetX = maybeChild.contentOffset?.[0] ?? 0;
      const childOffsetY = maybeChild.contentOffset?.[1] ?? 0;

      const childBoxX = boxX + child.displacement[0] - parentOffsetX + childOffsetX;
      const childBoxY = boxY + child.displacement[1] - parentOffsetY + childOffsetY;

      this.drawComponentBounds(child, childBoxX, childBoxY, mode, drawFn);
    }
  }

  private getBoundsQuad(component: Component, boxX: number, boxY: number, mode: BoundsMode) {
    const padding = component.effectiveRasterPadding ?? 0;
    const originX = boxX - padding;
    const originY = boxY - padding;

    const left = mode === 'logical' ? padding : 0;
    const top = mode === 'logical' ? padding : 0;
    const right = mode === 'logical' ? component.width - padding : component.width;
    const bottom = mode === 'logical' ? component.height - padding : component.height;

    const topLeft = forwardTransformPoint(component, left, top);
    const topRight = forwardTransformPoint(component, right, top);
    const bottomRight = forwardTransformPoint(component, right, bottom);
    const bottomLeft = forwardTransformPoint(component, left, bottom);

    return [
      { x: originX + topLeft.x, y: originY + topLeft.y },
      { x: originX + topRight.x, y: originY + topRight.y },
      { x: originX + bottomRight.x, y: originY + bottomRight.y },
      { x: originX + bottomLeft.x, y: originY + bottomLeft.y },
    ];
  }

  private drawQuad(quad: { x: number; y: number }[]) {
    this.context.beginPath();
    this.context.moveTo(quad[0].x, quad[0].y);
    this.context.lineTo(quad[1].x, quad[1].y);
    this.context.lineTo(quad[2].x, quad[2].y);
    this.context.lineTo(quad[3].x, quad[3].y);
    this.context.closePath();
    this.context.stroke();
  }
}
