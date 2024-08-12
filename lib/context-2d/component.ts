import { Vector } from '../linear-algebra/vector';



export interface ComponentOptions extends CanvasFillStrokeStyles, CanvasRenderingContext2DSettings, CanvasCompositing {
  name?: string;
  x?: number;
  y?: number;
  rotation?: number;
  scale?: [number, number];
  shear?: [number, number];
  perspective?: [number, number];
  reflect?: [number, number];
  children?: Component[];
}

/**
 * The base class of things that may be drawn on the canvas.
 * All drawable objects should inherit from this class.
 * Typically, it is unnecessary for application programmers to
 * call this directly, although they may wish to extend their own
 * classes with it.
 */
export default abstract class Component extends OffscreenCanvas {

  /**
   * a uuid for the object
   */
  readonly uuid = crypto.randomUUID();
  readonly context: OffscreenCanvasRenderingContext2D;
  readonly path: Path2D = new Path2D();


  /**
   * a name for the object 
   */
  name: string = `Component ${this.uuid}`;

  /**
   * theta θ 
   * the angle of rotation 
   */
  rotation: number = 0;

  /**
   * delta δ
   * the displacement from the origin
   */
  displacement: Vector = new Vector([0, 0]);

  /**
   * scale 
   * these values should always be >= 0 
   */
  scale: Vector = new Vector([1, 1]);

  /**
   * beta β
   * shear
   */
  shear: Vector = new Vector([0, 0]);

  /**
   * pi π
   * perspective
   */
  perspective: Vector = new Vector([1, 1]);

  /**
   * reflect across axis
   * these values should always be 1 or -1
   */
  reflect: Vector = new Vector([1, 1]);

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
    super(width, height);
    let [x, y] = [options?.x ?? 0, options?.y ?? 0];
    this.displacement = new Vector([x, y]);
    this.rotation = options?.rotation ?? 0;
    this.scale = new Vector(options?.scale ?? [1, 1]);
    this.shear = new Vector(options?.shear ?? [0, 0]);
    this.reflect = new Vector(options?.reflect ?? [1, 1]);
    this.perspective = new Vector(options?.perspective ?? [1, 1]);
    this.children = options?.children ?? [];
    let context = this.getContext('2d');
    if (!context) {
      throw new Error(`OffscreenCanvasRenderingContext2D could not be created for ${this.name}`);
    }
    this.context = context;
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
   * draw the object to canvas, render it if necessary
   * @param component component to draw to
   * @param offset the offset on the canvas - optional, used for prerendering
   */
  draw(component: Component, offset?: Vector) {
    if (this.dirty) {
      //clear any old rendering artifacts - they are no longer viable
      component.context.clearRect(0, 0, this.width, this.height);
      this.render();
      this.dirty = false;
    }

    //offsets are for prerendering contexts of compositions
    let x = offset?.[0] ?? 0;
    let y = offset?.[1] ?? 0;
    component.context.drawImage(this, x, y, this.width, this.height);
  }

  isPointInPath(...args: Parameters<typeof OffscreenCanvasRenderingContext2D.prototype.isPointInPath>) {
    return () => this.context.isPointInPath(...args);
  }

  isPointInStroke(...args: Parameters<typeof OffscreenCanvasRenderingContext2D.prototype.isPointInStroke>) {
    return () => this.context.isPointInStroke(...args);
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
        // this.needsDraw = true;
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
        // this.needsDraw = true;
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
        // this.parent.UpdateChildrenLists();
        // this.needsRender = true;
        // this.needsDraw = true;
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
        // this.parent.UpdateChildrenLists();
        // this.needsRender = true;
        // this.needsDraw = true;
      }
    }
  }
}
