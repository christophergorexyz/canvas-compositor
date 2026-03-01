"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("../linear-algebra/vector");
const component_1 = __importDefault(require("./component"));
/**
 * The Composition class is an extension of the Primitive that is
 * composed of other extensions of the Primitive. The Composition
 * is used to establish the Scene graph as the parent of all other
 * objects on screen. This is the key abstraction of the [composite
 * pattern](https://en.wikipedia.org/wiki/Composite_pattern): an
 * action taken on the parent element acts upon all of the children,
 * and transatively, all of their children.
 */
class Composition extends component_1.default {
    constructor(width, height, options) {
        var _a;
        super(width, height, options);
        this.boundsMode = 'fixed';
        this.autoResizeTargetCanvas = false;
        this._contentOffset = new vector_1.Vector([0, 0]);
        this.boundsMode = (_a = options === null || options === void 0 ? void 0 : options.boundsMode) !== null && _a !== void 0 ? _a : 'fixed';
    }
    get contentOffset() {
        return this._contentOffset;
    }
    _childRenderOffset(child) {
        if (child instanceof Composition) {
            return child.contentOffset;
        }
        return new vector_1.Vector([0, 0]);
    }
    _updateBoundsForChildren() {
        if (this.boundsMode !== 'auto-expand' || this.children.length === 0) {
            this._contentOffset = new vector_1.Vector([0, 0]);
            return;
        }
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const child of this.children) {
            const childRenderOffset = this._childRenderOffset(child);
            const left = child.displacement[0] + childRenderOffset[0];
            const top = child.displacement[1] + childRenderOffset[1];
            const right = left + child.width;
            const bottom = top + child.height;
            minX = Math.min(minX, left);
            minY = Math.min(minY, top);
            maxX = Math.max(maxX, right);
            maxY = Math.max(maxY, bottom);
        }
        if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
            this._contentOffset = new vector_1.Vector([0, 0]);
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
        this._contentOffset = new vector_1.Vector([minX, minY]);
    }
    /**
     * the an array of children that are found at (x, y)
     * @return {object} childrenAt all the children below the point
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     */
    childrenAt(x, y) {
        return this.children.filter((child) => {
            const childRenderOffset = this._childRenderOffset(child);
            let localX = x - child.displacement[0] + this._contentOffset[0] - childRenderOffset[0];
            let localY = y - child.displacement[1] + this._contentOffset[1] - childRenderOffset[1];
            const pivot = child.rotationPivot;
            const tx = localX - pivot[0];
            const ty = localY - pivot[1];
            const c = Math.cos(child.rotation);
            const s = Math.sin(child.rotation);
            let ux = tx * c + ty * s;
            let uy = -tx * s + ty * c;
            if (child.reflect[0] < 0) {
                ux = -ux;
            }
            if (child.reflect[1] < 0) {
                uy = -uy;
            }
            localX = ux + pivot[0];
            localY = uy + pivot[1];
            return child.isPointInPath(child.path, localX, localY);
        });
    }
    /**
     * get the top-most child at the point (x, y)
     */
    childAt(x, y) {
        //loop over the children in reverse because the last in the list is drawn on the top
        return [...this.children].reverse().find((child) => {
            const childRenderOffset = this._childRenderOffset(child);
            let localX = x - child.displacement[0] + this._contentOffset[0] - childRenderOffset[0];
            let localY = y - child.displacement[1] + this._contentOffset[1] - childRenderOffset[1];
            const pivot = child.rotationPivot;
            const tx = localX - pivot[0];
            const ty = localY - pivot[1];
            const c = Math.cos(child.rotation);
            const s = Math.sin(child.rotation);
            let ux = tx * c + ty * s;
            let uy = -tx * s + ty * c;
            if (child.reflect[0] < 0) {
                ux = -ux;
            }
            if (child.reflect[1] < 0) {
                uy = -uy;
            }
            localX = ux + pivot[0];
            localY = uy + pivot[1];
            return child.isPointInPath(child.path, localX, localY);
        });
    }
    draw(component, offset) {
        var _a, _b;
        if (this.dirty) {
            this.context.clearRect(0, 0, this.width, this.height);
            this.render();
            this.dirty = false;
        }
        if (component === this) {
            return;
        }
        const x = ((_a = offset === null || offset === void 0 ? void 0 : offset[0]) !== null && _a !== void 0 ? _a : 0) + this._contentOffset[0];
        const y = ((_b = offset === null || offset === void 0 ? void 0 : offset[1]) !== null && _b !== void 0 ? _b : 0) + this._contentOffset[1];
        component.context.drawImage(this, x, y, this.width, this.height);
    }
    /**
     * add a child to this composition
     */
    addChild(child) {
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
    addChildren(children) {
        children.forEach((child) => this.addChild(child));
    }
    /**
     * remove a child from this composition
     */
    removeChild(child) {
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
            const drawOffset = new vector_1.Vector([
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
}
exports.default = Composition;
//# sourceMappingURL=composition.js.map