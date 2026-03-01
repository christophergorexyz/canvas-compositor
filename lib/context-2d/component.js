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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
        this._rotation = 0;
        this._rotationOrigin = 'origin';
        /**
         * delta δ
         * the displacement from the origin
         */
        this._displacement = new vector_1.Vector([0, 0]);
        /**
         * scale
         * these values should always be >= 0
         */
        this._scale = new vector_1.Vector([1, 1]);
        /**
         * beta β
         * shear
         */
        this._shear = new vector_1.Vector([0, 0]);
        /**
         * pi π
         * perspective
         */
        this._perspective = new vector_1.Vector([1, 1]);
        /**
         * reflect across axis
         * these values should always be 1 or -1
         */
        this._reflect = new vector_1.Vector([1, 1]);
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
        this.rotationOrigin = (_d = options === null || options === void 0 ? void 0 : options.rotationOrigin) !== null && _d !== void 0 ? _d : 'origin';
        this.scale = new vector_1.Vector((_e = options === null || options === void 0 ? void 0 : options.scale) !== null && _e !== void 0 ? _e : [1, 1]);
        this.shear = new vector_1.Vector((_f = options === null || options === void 0 ? void 0 : options.shear) !== null && _f !== void 0 ? _f : [0, 0]);
        this.reflect = new vector_1.Vector((_g = options === null || options === void 0 ? void 0 : options.reflect) !== null && _g !== void 0 ? _g : [1, 1]);
        this.perspective = new vector_1.Vector((_h = options === null || options === void 0 ? void 0 : options.perspective) !== null && _h !== void 0 ? _h : [1, 1]);
        this.children = (_j = options === null || options === void 0 ? void 0 : options.children) !== null && _j !== void 0 ? _j : [];
        this.children.forEach((child) => child.parent = this);
        let context = this.getContext('2d');
        if (!context) {
            throw new Error(`OffscreenCanvasRenderingContext2D could not be created for ${this.name}`);
        }
        this.context = context;
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(value) {
        this._rotation = value;
        this.invalidate();
    }
    get rotationOrigin() {
        return this._rotationOrigin;
    }
    set rotationOrigin(value) {
        this._rotationOrigin = value;
        this.invalidate();
    }
    get rotationPivot() {
        if (this.rotationOrigin === 'center') {
            return new vector_1.Vector([this.width / 2, this.height / 2]);
        }
        if (this.rotationOrigin === 'origin') {
            return new vector_1.Vector([0, 0]);
        }
        return new vector_1.Vector(this.rotationOrigin);
    }
    get displacement() {
        return this._displacement;
    }
    set displacement(value) {
        this._displacement = value;
        this.invalidate();
    }
    get scale() {
        return this._scale;
    }
    set scale(value) {
        this._scale = value;
        this.invalidate();
    }
    get shear() {
        return this._shear;
    }
    set shear(value) {
        this._shear = value;
        this.invalidate();
    }
    get perspective() {
        return this._perspective;
    }
    set perspective(value) {
        this._perspective = value;
        this.invalidate();
    }
    get reflect() {
        return this._reflect;
    }
    set reflect(value) {
        this._reflect = value;
        this.invalidate();
    }
    /**
     * mark this component as dirty and propagate to all ancestors
     */
    invalidate() {
        var _a;
        this.dirty = true;
        (_a = this.parent) === null || _a === void 0 ? void 0 : _a.invalidate();
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
            this.context.clearRect(0, 0, this.width, this.height);
            this.render();
            this.dirty = false;
        }
        //offsets are for prerendering contexts of compositions
        let x = (_a = offset === null || offset === void 0 ? void 0 : offset[0]) !== null && _a !== void 0 ? _a : 0;
        let y = (_b = offset === null || offset === void 0 ? void 0 : offset[1]) !== null && _b !== void 0 ? _b : 0;
        const rotation = this.rotation;
        const reflectX = this.reflect[0] < 0 ? -1 : 1;
        const reflectY = this.reflect[1] < 0 ? -1 : 1;
        const pivot = this.rotationPivot;
        if (rotation === 0 && reflectX === 1 && reflectY === 1) {
            component.context.drawImage(this, x, y, this.width, this.height);
            return;
        }
        component.context.save();
        component.context.translate(x + pivot[0], y + pivot[1]);
        component.context.rotate(rotation);
        component.context.scale(reflectX, reflectY);
        component.context.translate(-pivot[0], -pivot[1]);
        component.context.drawImage(this, 0, 0, this.width, this.height);
        component.context.restore();
    }
    isPointInPath(...args) {
        return this.context.isPointInPath(...args);
    }
    isPointInStroke(...args) {
        return this.context.isPointInStroke(...args);
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
exports.default = Component;
//# sourceMappingURL=component.js.map