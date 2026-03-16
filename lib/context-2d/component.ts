import { Vector } from '../linear-algebra/vector';
import { IRenderTarget } from '../rendering/canvas-2d-render-target';
import Canvas2DRenderer, { IBitmapRenderOutput, IRenderOutput, IRendererBackend } from '../rendering/canvas-2d-renderer';

interface WithContentOffset {
  contentOffset?: Vector;
}

export interface ReparentOptions {
  preserveWorldPosition?: boolean;
}

export type RotationOrigin = 'origin' | 'center' | [number, number];


export interface ComponentOptions extends Partial<CanvasFillStrokeStyles>, Partial<CanvasRenderingContext2DSettings>, Partial<CanvasCompositing> {
  name?: string;
  x?: number;
  y?: number;
  rasterPadding?: number;
  rotation?: number;
  scale?: [number, number];
  shear?: [number, number];
  perspective?: [number, number];
  reflect?: [number, number];
  rotationOrigin?: RotationOrigin;
  children?: Component[];
  renderer?: IRendererBackend;
}


const defaultRenderer = new Canvas2DRenderer();

/**
 * The base class of things that may be drawn on the canvas.
 * All drawable objects should inherit from this class.
 * Typically, it is unnecessary for application programmers to
 * call this directly, although they may wish to extend their own
 * classes with it.
 */
export default abstract class Component {

  /**
   * a uuid for the object
   */
  readonly uuid = crypto.randomUUID();
  readonly renderer: IRendererBackend;
  readonly renderTarget: IRenderTarget;
  readonly context: OffscreenCanvasRenderingContext2D;
  readonly path: Path2D = new Path2D();
  private _rasterPadding: number = 0;
  private _effectiveRasterPadding: number = 0;
  private _contentWidth: number;
  private _contentHeight: number;


  /**
   * a name for the object
   */
  name: string = `Component ${this.uuid}`;

  /**
   * theta θ
   * the angle of rotation
   */
  private _rotation: number = 0;
  private _rotationOrigin: RotationOrigin = 'origin';

  /**
   * delta δ
   * the displacement from the origin
   */
  private _displacement: Vector = new Vector([0, 0]);

  /**
   * scale
   * these values should always be >= 0
   */
  private _scale: Vector = new Vector([1, 1]);

  /**
   * beta β
   * shear
   */
  private _shear: Vector = new Vector([0, 0]);

  /**
   * pi π
   * perspective
   */
  private _perspective: Vector = new Vector([1, 1]);

  /**
   * reflect across axis
   * these values should always be 1 or -1
   */
  private _reflect: Vector = new Vector([1, 1]);

  /**
   * a dirty bit to ensure we render when necessary
   */
  dirty: boolean = true;


  /**
   * the parent `Component`, or `null` if not attached or the scene composition `Component`
   */
  parent?: Component;

  /**
   * The children `Component`s if any, otherwise the empty list
   */
  children: Component[] = [];

  /**
   * the render method should be implemented by subclasses
   */
  abstract render(): void;

  constructor(width: number, height: number, options?: ComponentOptions) {
    const rasterPadding = Math.max(0, Math.ceil(options?.rasterPadding ?? 0));
    this.renderer = options?.renderer ?? defaultRenderer;
    this.renderTarget = this.renderer.createRenderTarget(width + (2 * rasterPadding), height + (2 * rasterPadding));
    this._rasterPadding = rasterPadding;
    this._effectiveRasterPadding = rasterPadding;
    this._contentWidth = width;
    this._contentHeight = height;
    let [x, y] = [options?.x ?? 0, options?.y ?? 0];
    this.displacement = new Vector([x, y]);
    this.rotation = options?.rotation ?? 0;
    this.rotationOrigin = options?.rotationOrigin ?? 'origin';
    this.scale = new Vector(options?.scale ?? [1, 1]);
    this.shear = new Vector(options?.shear ?? [0, 0]);
    this.reflect = new Vector(options?.reflect ?? [1, 1]);
    this.perspective = new Vector(options?.perspective ?? [1, 1]);
    this.name = options?.name ?? this.name;
    this.children = options?.children ?? [];
    this.children.forEach((child) => {
      child.parent = this;
    });
    this.context = this.renderTarget.context;
  }

  get width() {
    return this.renderTarget.width;
  }

  set width(value: number) {
    this.renderTarget.width = value;
  }

  get height() {
    return this.renderTarget.height;
  }

  set height(value: number) {
    this.renderTarget.height = value;
  }

  get rotation(): number {
    return this._rotation;
  }

  set rotation(value: number) {
    this._rotation = value;
    this.invalidate();
  }

  get rotationOrigin(): RotationOrigin {
    return this._rotationOrigin;
  }

  set rotationOrigin(value: RotationOrigin) {
    this._rotationOrigin = value;
    this.invalidate();
  }

  get rotationPivot(): Vector {
    const padding = this.effectiveRasterPadding;

    if (this.rotationOrigin === 'center') {
      return new Vector([
        padding + (this._contentWidth / 2),
        padding + (this._contentHeight / 2),
      ]);
    }

    if (this.rotationOrigin === 'origin') {
      return new Vector([padding, padding]);
    }

    return new Vector([
      this.rotationOrigin[0] + padding,
      this.rotationOrigin[1] + padding,
    ]);
  }

  get displacement(): Vector {
    return this._displacement;
  }

  set displacement(value: Vector) {
    this._displacement = value;
    this.invalidate();
  }

  get scale(): Vector {
    return this._scale;
  }

  set scale(value: Vector) {
    this._scale = value;
    this.invalidate();
  }

  get shear(): Vector {
    return this._shear;
  }

  set shear(value: Vector) {
    this._shear = value;
    this.invalidate();
  }

  get perspective(): Vector {
    return this._perspective;
  }

  set perspective(value: Vector) {
    this._perspective = value;
    this.invalidate();
  }

  get reflect(): Vector {
    return this._reflect;
  }

  set reflect(value: Vector) {
    this._reflect = value;
    this.invalidate();
  }

  /**
   * mark this component as dirty and propagate to all ancestors
   */
  invalidate() {
    this.dirty = true;
    this.parent?.invalidate();
  }

  /**
   * the global offset of the object on the canvas.
   * this is the sum of this object's displacement
   * and all of its ancestry. offset a 2D Vector
   * representing displacement from [0, 0]
   */
  get offset(): Vector {
    return (this.parent ? this.displacement.add(this.parent.offset) : this.displacement);
  }

  /**
   * Render-space offset including parent composition content offsets.
   */
  get renderedOffset(): Vector {
    if (!this.parent) {
      return this.displacement;
    }

    const parentOffset = this.parent.renderedOffset;
    const parentContentOffset = (this.parent as Component & WithContentOffset).contentOffset;
    const contentOffsetX = parentContentOffset?.[0] ?? 0;
    const contentOffsetY = parentContentOffset?.[1] ?? 0;

    return new Vector([
      this.displacement[0] - contentOffsetX + parentOffset[0],
      this.displacement[1] - contentOffsetY + parentOffset[1],
    ]);
  }

  /**
   * Move this component from its current parent to a target composition.
   * By default, preserves render-space position.
   */
  reparentTo(targetParent: Component & { addChild: (child: Component) => unknown; contentOffset?: Vector }, options?: ReparentOptions) {
    const preserveWorldPosition = options?.preserveWorldPosition ?? true;
    const worldBefore = preserveWorldPosition ? this.renderedOffset : null;

    targetParent.addChild(this);

    if (!worldBefore) {
      return;
    }

    const parentRenderedOffset = targetParent.renderedOffset;
    const parentContentOffset = targetParent.contentOffset;
    const contentOffsetX = parentContentOffset?.[0] ?? 0;
    const contentOffsetY = parentContentOffset?.[1] ?? 0;

    this.displacement = new Vector([
      worldBefore[0] - parentRenderedOffset[0] + contentOffsetX,
      worldBefore[1] - parentRenderedOffset[1] + contentOffsetY,
    ]);
  }

  /**
   * return the horizontal scale of the object - defaults to 1
   */
  get scaleWidth() {
    return this.scale[0];
  }

  set scaleWidth(val) {
    this.scale = new Vector([val, this.scale[1]]);
  }

  /**
   * return the vertical scale of the object - defaults to 1
   */
  get scaleHeight() {
    return this.scale[1];
  }

  /**
   * set the vertical scale of the object - defaults to 1
   * @param {number} val the vertical scale
   */
  set scaleHeight(val) {
    this.scale = new Vector([this.scale[0], val]);
  }

  /**
   * return the scale of the object, compounded with the parent object's scale
   * the scale multiplied by the compound scale of its parent or 1
   * @type {Vector}
   */
  get compoundScale(): Vector {
    return this.parent ? this.scale.multiply(this.parent.compoundScale) : this.scale;
  }

  /**
   * extra internal pixels reserved around the drawable path
   * to avoid clipping centered strokes on offscreen canvases
   */
  get rasterPadding() {
    return this._rasterPadding;
  }

  /**
   * active raster padding, including dynamic stroke-derived padding
   */
  get effectiveRasterPadding() {
    return this._effectiveRasterPadding;
  }

  private _strokePadding() {
    const lineWidth = this.context.lineWidth;
    if (!Number.isFinite(lineWidth) || lineWidth <= 1) {
      return 0;
    }

    return Math.ceil(lineWidth / 2);
  }

  private _syncRasterPaddingToStroke() {
    const nextPadding = Math.max(this.rasterPadding, this._strokePadding());
    if (nextPadding === this._effectiveRasterPadding) {
      return;
    }

    const preservedState = {
      fillStyle: this.context.fillStyle,
      strokeStyle: this.context.strokeStyle,
      lineWidth: this.context.lineWidth,
      lineCap: this.context.lineCap,
      lineJoin: this.context.lineJoin,
      miterLimit: this.context.miterLimit,
      lineDash: this.context.getLineDash(),
      lineDashOffset: this.context.lineDashOffset,
      globalAlpha: this.context.globalAlpha,
      globalCompositeOperation: this.context.globalCompositeOperation,
      shadowBlur: this.context.shadowBlur,
      shadowColor: this.context.shadowColor,
      shadowOffsetX: this.context.shadowOffsetX,
      shadowOffsetY: this.context.shadowOffsetY,
      filter: this.context.filter,
      font: this.context.font,
      textAlign: this.context.textAlign,
      textBaseline: this.context.textBaseline,
      direction: this.context.direction,
      imageSmoothingEnabled: this.context.imageSmoothingEnabled,
      imageSmoothingQuality: this.context.imageSmoothingQuality,
    };

    this._effectiveRasterPadding = nextPadding;
    this.renderTarget.resize(this._contentWidth + (2 * nextPadding), this._contentHeight + (2 * nextPadding));
    this.context.fillStyle = preservedState.fillStyle;
    this.context.strokeStyle = preservedState.strokeStyle;
    this.context.lineWidth = preservedState.lineWidth;
    this.context.lineCap = preservedState.lineCap;
    this.context.lineJoin = preservedState.lineJoin;
    this.context.miterLimit = preservedState.miterLimit;
    this.context.setLineDash(preservedState.lineDash);
    this.context.lineDashOffset = preservedState.lineDashOffset;
    this.context.globalAlpha = preservedState.globalAlpha;
    this.context.globalCompositeOperation = preservedState.globalCompositeOperation;
    this.context.shadowBlur = preservedState.shadowBlur;
    this.context.shadowColor = preservedState.shadowColor;
    this.context.shadowOffsetX = preservedState.shadowOffsetX;
    this.context.shadowOffsetY = preservedState.shadowOffsetY;
    this.context.filter = preservedState.filter;
    this.context.font = preservedState.font;
    this.context.textAlign = preservedState.textAlign;
    this.context.textBaseline = preservedState.textBaseline;
    this.context.direction = preservedState.direction;
    this.context.imageSmoothingEnabled = preservedState.imageSmoothingEnabled;
    this.context.imageSmoothingQuality = preservedState.imageSmoothingQuality;
  }

  protected ensureRenderIsCurrent() {
    if (!this.dirty) {
      return;
    }

    this._syncRasterPaddingToStroke();
    this.renderTarget.clear();
    if (this.effectiveRasterPadding > 0) {
      this.context.save();
      this.context.translate(this.effectiveRasterPadding, this.effectiveRasterPadding);
      this.render();
      this.context.restore();
    } else {
      this.render();
    }
    this.dirty = false;
  }

  getRenderOutput(): IRenderOutput {
    this.ensureRenderIsCurrent();

    const output: IBitmapRenderOutput = {
      kind: 'bitmap',
      source: this.renderTarget.getImageSource(),
      width: this.width,
      height: this.height,
    };

    return output;
  }

  /**
   * draw the object to canvas, render it if necessary
   * @param component component to draw to
   * @param offset the offset on the canvas - optional, used for prerendering
   */
  draw(component: Component, offset?: Vector) {
    const output = this.getRenderOutput();

    //offsets are for prerendering contexts of compositions
    let x = (offset?.[0] ?? 0) - this.effectiveRasterPadding;
    let y = (offset?.[1] ?? 0) - this.effectiveRasterPadding;

    const rotation = this.rotation;
    const reflectX = this.reflect[0] < 0 ? -1 : 1;
    const reflectY = this.reflect[1] < 0 ? -1 : 1;
    const pivot = this.rotationPivot;
    this.renderer.drawRenderOutput(output, component.context, {
      x,
      y,
      width: this.width,
      height: this.height,
      rotation,
      pivotX: pivot[0],
      pivotY: pivot[1],
      reflectX,
      reflectY,
    });
  }

  isPointInPath(...args: Parameters<typeof OffscreenCanvasRenderingContext2D.prototype.isPointInPath>) {
    return this.context.isPointInPath(...args);
  }

  isPointInStroke(...args: Parameters<typeof OffscreenCanvasRenderingContext2D.prototype.isPointInStroke>) {
    return this.context.isPointInStroke(...args);
  }

  transferToImageBitmap() {
    return this.renderTarget.transferToImageBitmap();
  }

  /**
   * move the object on top of other objects (render last)
   */
  moveToFront() {
    if (this.parent) {
      let index = this.parent.children.indexOf(this);
      if (index >= 0) {
        this.parent.children.splice(index, 1);
        this.parent.children.splice(this.parent.children.length, 0, this);
        this.parent.invalidate();
      }
    }
  }

  /**
   * move the object below the other objects (render first)
   */
  moveToBack() {
    if (this.parent) {
      let index = this.parent.children.indexOf(this);
      if (index >= 0) {
        this.parent.children.splice(index, 1);
        this.parent.children.splice(0, 0, this);
        this.parent.invalidate();
      }
    }
  }


  /**
   * move the object forward in the stack (drawn later)
   */
  moveForward() {

    if (this.parent) {
      let index = this.parent.children.indexOf(this);
      if (index >= 0 && index < this.parent.children.length - 1) {
        this.parent.children.splice(index, 1);
        this.parent.children.splice(index + 1, 0, this); //if index + 1 > siblings.length, inserts it at end
        this.parent.invalidate();
      }
    }
  }

  /**
   * move the object backward in the stack (drawn sooner)
   */
  moveBackward() {
    if (this.parent) {
      let index = this.parent.children.indexOf(this);
      if (index > 0) {
        this.parent.children.splice(index, 1);
        this.parent.children.splice(index - 1, 0, this);
        this.parent.invalidate();
      }
    }
  }
}
