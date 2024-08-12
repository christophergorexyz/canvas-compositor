"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("../linear-algebra/vector");
/**
 * The base class of things that may be drawn on the canvas.
 * All drawable objects should inherit from this class.
 * Typically, it is unnecessary for application programmers to
 * call this directly, although they may wish to extend their own
 * classes with it.
 */
class Component extends OffscreenCanvas {
    constructor(width, height, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        super(width, height);
        /**
         * a uuid for the object
         */
        this.uuid = crypto.randomUUID();
        this.path = new Path2D();
        /**
         * a name for the object
         */
        this.name = `Component ${this.uuid}`;
        /**
         * theta θ
         * the angle of rotation
         */
        this.rotation = 0;
        /**
         * delta δ
         * the displacement from the origin
         */
        this.displacement = new vector_1.Vector([0, 0]);
        /**
         * scale
         * these values should always be >= 0
         */
        this.scale = new vector_1.Vector([1, 1]);
        /**
         * beta β
         * shear
         */
        this.shear = new vector_1.Vector([0, 0]);
        /**
         * pi π
         * perspective
         */
        this.perspective = new vector_1.Vector([1, 1]);
        /**
         * reflect across axis
         * these values should always be 1 or -1
         */
        this.reflect = new vector_1.Vector([1, 1]);
        /**
         * a dirty bit to ensure we render when necessary
         */
        this.dirty = true;
        /**
         * The children `Component`s if any, otherwise the empty list
         */
        this.children = [];
        let [x, y] = [(_a = options === null || options === void 0 ? void 0 : options.x) !== null && _a !== void 0 ? _a : 0, (_b = options === null || options === void 0 ? void 0 : options.y) !== null && _b !== void 0 ? _b : 0];
        this.displacement = new vector_1.Vector([x, y]);
        this.rotation = (_c = options === null || options === void 0 ? void 0 : options.rotation) !== null && _c !== void 0 ? _c : 0;
        this.scale = new vector_1.Vector((_d = options === null || options === void 0 ? void 0 : options.scale) !== null && _d !== void 0 ? _d : [1, 1]);
        this.shear = new vector_1.Vector((_e = options === null || options === void 0 ? void 0 : options.shear) !== null && _e !== void 0 ? _e : [0, 0]);
        this.reflect = new vector_1.Vector((_f = options === null || options === void 0 ? void 0 : options.reflect) !== null && _f !== void 0 ? _f : [1, 1]);
        this.perspective = new vector_1.Vector((_g = options === null || options === void 0 ? void 0 : options.perspective) !== null && _g !== void 0 ? _g : [1, 1]);
        this.children = (_h = options === null || options === void 0 ? void 0 : options.children) !== null && _h !== void 0 ? _h : [];
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
    get offset() {
        return (this.parent ? this.displacement.add(this.parent.offset) : this.displacement);
    }
    /**
     * return the horizontal scale of the object - defaults to 1
     */
    get scaleWidth() {
        return this.scale[0];
    }
    set scaleWidth(val) {
        this.scale = new vector_1.Vector([val, this.scale[1]]);
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
        this.scale = new vector_1.Vector([this.scale[0], val]);
    }
    /**
     * return the scale of the object, compounded with the parent object's scale
     * the scale multiplied by the compound scale of its parent or 1
     * @type {Vector}
     */
    get compoundScale() {
        return this.parent ? this.scale.multiply(this.parent.compoundScale) : this.scale;
    }
    /**
     * draw the object to canvas, render it if necessary
     * @param component component to draw to
     * @param offset the offset on the canvas - optional, used for prerendering
     */
    draw(component, offset) {
        var _a, _b;
        if (this.dirty) {
            //clear any old rendering artifacts - they are no longer viable
            component.context.clearRect(0, 0, this.width, this.height);
            this.render();
            this.dirty = false;
        }
        //offsets are for prerendering contexts of compositions
        let x = (_a = offset === null || offset === void 0 ? void 0 : offset[0]) !== null && _a !== void 0 ? _a : 0;
        let y = (_b = offset === null || offset === void 0 ? void 0 : offset[1]) !== null && _b !== void 0 ? _b : 0;
        component.context.drawImage(this, x, y, this.width, this.height);
    }
    isPointInPath(...args) {
        return () => this.context.isPointInPath(...args);
    }
    isPointInStroke(...args) {
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
exports.default = Component;
//# sourceMappingURL=component.js.map