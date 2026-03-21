import { Vector } from '../linear-algebra/vector';
import Component, { ComponentOptions, ReparentOptions } from './component';
import { forwardTransformPoint, hitTestComponent, inverseTransformPoint, localPointForChild } from './transform-utils';

export type CompositionBoundsMode = 'fixed' | 'auto-expand';

export interface CompositionOptions extends ComponentOptions {
  boundsMode?: CompositionBoundsMode;
}

/**
 * The Composition class is an extension of the Primitive that is
 * composed of other extensions of the Primitive. The Composition
 * is used to establish the Scene graph as the parent of all other
 * objects on screen. This is the key abstraction of the [composite
 * pattern](https://en.wikipedia.org/wiki/Composite_pattern): an
 * action taken on the parent element acts upon all of the children,
 * and transatively, all of their children.
 */
export default class Composition extends Component {
  boundsMode: CompositionBoundsMode = 'fixed';
  autoResizeTargetCanvas: boolean = false;

  private _contentOffset: Vector = new Vector([0, 0]);

  constructor(width: number, height: number, options?: CompositionOptions) {
    super(width, height, options);
    this.boundsMode = options?.boundsMode ?? 'fixed';
  }

  get contentOffset(): Vector {
    return this._contentOffset;
  }

  private _childRenderOffset(child: Component): Vector {
    if (child instanceof Composition) {
      return child.contentOffset;
    }

    return new Vector([0, 0]);
  }

  private _updateBoundsForChildren() {
    if (this.boundsMode !== 'auto-expand' || this.children.length === 0) {
      this._contentOffset = new Vector([0, 0]);
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const child of this.children) {
      const childRenderOffset = this._childRenderOffset(child);
      const rasterPadding = child.effectiveRasterPadding;
      const originX = child.displacement[0] + childRenderOffset[0] - rasterPadding;
      const originY = child.displacement[1] + childRenderOffset[1] - rasterPadding;

      const topLeft = forwardTransformPoint(child, 0, 0);
      const topRight = forwardTransformPoint(child, child.width, 0);
      const bottomRight = forwardTransformPoint(child, child.width, child.height);
      const bottomLeft = forwardTransformPoint(child, 0, child.height);

      const childMinX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x) + originX;
      const childMinY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y) + originY;
      const childMaxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x) + originX;
      const childMaxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y) + originY;

      minX = Math.min(minX, childMinX);
      minY = Math.min(minY, childMinY);
      maxX = Math.max(maxX, childMaxX);
      maxY = Math.max(maxY, childMaxY);
    }

    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
      this._contentOffset = new Vector([0, 0]);
      return;
    }

    const nextWidth = Math.max(1, Math.ceil(maxX - minX));
    const nextHeight = Math.max(1, Math.ceil(maxY - minY));

    if (this.width !== nextWidth) {
      this.width = nextWidth;
    }

    if (this.height !== nextHeight) {
      this.height = nextHeight;
    }

    this._contentOffset = new Vector([minX, minY]);
  }

  /**
   * the an array of children that are found at (x, y)
   * @return {object} childrenAt all the children below the point
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   */
  childrenAt(x: number, y: number) {
    return this.children.filter((child) => {
      const localPoint = localPointForChild(this, child, x, y);
      const untransformed = inverseTransformPoint(child, localPoint.x, localPoint.y);

      return hitTestComponent(child, untransformed.x, untransformed.y, true);
    });
  }

  /**
   * get the top-most child at the point (x, y)
   */
  childAt(x: number, y: number) {
    //loop over the children in reverse because the last in the list is drawn on the top
    return [...this.children].reverse().find((child) => {
      const localPoint = localPointForChild(this, child, x, y);
      const untransformed = inverseTransformPoint(child, localPoint.x, localPoint.y);

      return hitTestComponent(child, untransformed.x, untransformed.y, true);
    });
  }

  draw(component: Component, offset?: Vector) {
    const output = this.getRenderOutput();

    if (component === this) {
      return;
    }

    const x = (offset?.[0] ?? 0) + this._contentOffset[0];
    const y = (offset?.[1] ?? 0) + this._contentOffset[1];
    this.renderer.drawRenderOutput(output, component.context, {
      x,
      y,
      width: this.width,
      height: this.height,
    });
  }

  /**
   * add a child to this composition
   */
  addChild(child: Component) {
    if (child.parent && child.parent !== this) {
      const index = child.parent.children.indexOf(child);
      if (index >= 0) {
        child.parent.children.splice(index, 1);
        child.parent.invalidate();
      }
    }

    child.parent = this;
    this.children.push(child);
    this.invalidate();
  }

  /**
   * add multiple children to the composition
   */
  addChildren(children: Component[]) {
    children.forEach((child) => this.addChild(child));
  }

  /**
   * Reparent a child from this composition into another composition.
   */
  reparentChild(child: Component, targetParent: Composition, options?: ReparentOptions) {
    if (this.children.indexOf(child) < 0) {
      return;
    }

    child.reparentTo(targetParent, options);
  }

  /**
   * remove a child from this composition
   */
  removeChild(child: Component) {

    const index = this.children.indexOf(child);
    if (index >= 0) {
      const removed = this.children.splice(index, 1);
      child.parent = undefined;
      this.invalidate();
      return removed;
    }
  }

  /**
   * override the render function to render the children onto this compositions prerendering canvas
   * @override
   */
  render() {
    this._updateBoundsForChildren();

    // required to make sure that the drawing occurs within the bounds of this composition
    for (const c of this.children) {
      const drawOffset = new Vector([
        c.displacement[0] - this._contentOffset[0],
        c.displacement[1] - this._contentOffset[1],
      ]);
      c.draw(this, drawOffset);
    }

    // `destination-out` will erase things
    //this._prerenderingContext.globalCompositeOperation = 'destination-out';
    //_.each(this.masks, function (m) {
    //m.draw(renderContext, contextOffset);
    //});
    //renderContext.globalCompositeOperation = 'normal';
  }

  protected override ensureRenderIsCurrent() {
    if (!this.dirty) {
      return;
    }

    this.renderTarget.clear();
    this.render();
    this.dirty = false;
  }

  override prepareForComposition() {
    for (const child of this.children) {
      child.prepareForComposition();
    }

    this._updateBoundsForChildren();
  }
}
