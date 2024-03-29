import { Vector } from 'ts-matrix';
import { IBoundingBox } from './bounding-box';

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
  readonly uuid: string = crypto.randomUUID();

  readonly context: OffscreenCanvasRenderingContext2D;

  private _boundingPath?: Path2D;

  /**
   * a name for the object 
   */
  name: string = '';

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
   * d
   */
  dirtyPath: boolean = true;

  /**
   * the parent `Component`, or `null` if not attached or the scene composition `Component`
   */
  parent?: Component;

  /**
   * The children `Component`s if any, otherwise the empty list
   */
  children: Component[] = [];

  abstract get boundingBox(): IBoundingBox;

  get boundingPath(): Path2D {
    if (this.dirtyPath || !this._boundingPath) {
      this._boundingPath = new Path2D();
    }
    return this._boundingPath;
  }

  /**
   * the render method should be implemented by subclasses
   */
  abstract render(): void;

  constructor(width: number, height: number) {
    super(width, height);
    let context = this.getContext('2d');
    if (!context) {
      throw new Error(`OffscreenCanvasRenderingContext2D could not be created for ${this.uuid}`);
    }
    this.context = context;
  }

  /**
   * the global offset of the object on the canvas.
   * this is the sum of this object's displacement
   * and all of its ancestry. offset a 2D Vector
   * representing displacement from [0, 0]
   * @type {Vector}
   */
  get offset(): Vector {
    return (this.parent ? this.displacement.add(this.parent.offset) : this.displacement);
  }

  /**
   * return the horizontal scale of the object - defaults to 1
   * @type {number}
   */
  get scaleWidth() {
    return this.scale.at(0);
  }
  /**
   * set the horizontal scale of the object - defaults to 1
   * @type {number}
   */
  set scaleWidth(val) {
    //this._scaleWidth = val;
    this.scale.values = [val, this.scale.at(1)];
    // this.needsRender = true;
    // this.needsDraw = true;
    // for (let c of this.children) {
    //   c.needsRender = true;
    //   c.needsDraw = true;
    // }
  }

  /**
   * return the vertical scale of the object - defaults to 1
   * @type {number}
   */
  get scaleHeight() {
    return this.scale.at(1);
  }

  /**
   * set the vertical scale of the object - defaults to 1
   * @param {number} val the vertical scale
   */
  set scaleHeight(val) {
    // this._scaleHeight = val;
    this.scale.values = [this.scale.at(0), val];
    // this.needsRender = true;
    // this.needsDraw = true;
    // for (let c of this.children) {
    //   c.needsRender = true;
    //   c.needsDraw = true;
    // }
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
  draw(component: Component, offset?: [number, number]) {
    let boundingBox = this.boundingBox;
    if (this.dirty) {
      //clear any old rendering artifacts - they are no longer viable
      component.context.clearRect(boundingBox.left, boundingBox.top, this.width, this.height);
      this.render();
      this.dirty = false;
    }

    //offsets are for prerendering contexts of compositions
    let x = boundingBox.left + (offset?.[0] ?? 0);
    let y = boundingBox.top + (offset?.[1] ?? 0);
    component.context.drawImage(this, x, y, this.width, this.height);
  }

  /**
   * check whether the point specified lies *inside* this objects bounding box
   *
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   * @return {boolean} whether the point is within the bounding box
   */
  pointIsInBoundingBox(x: number, y: number) {
    let boundingBox = this.boundingBox;
    return (
      x > boundingBox.left &&
      y > boundingBox.top &&
      x < boundingBox.right &&
      y < boundingBox.bottom
    );
  }

  /**
   * check whether the point is within the object.
   * this method should be overridden by subclassess
   *
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   * @return {boolean} whether the point is in the object, as implemented by inheriting classes
   */
  pointIsInObject(x: number, y: number) {
    return this.pointIsInBoundingBox(x, y);
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
