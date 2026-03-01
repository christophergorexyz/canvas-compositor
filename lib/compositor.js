"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const composition_1 = __importDefault(require("./context-2d/composition"));
/**
 * The Compositor class is the entry-point to usage of the `canvas-compositor`.
 * The application programmer is expected to hand over low-level control of the canvas
 * context to the high-level classes and methods exposed by CanvasCompositor.
 *
 * The Compositor class establishes an event dispatcher, animation loop, and scene graph for
 * compositions.
 */
class Compositor extends EventTarget {
    /**
     * The Compositor class establishes an event dispatcher, animation loop, and scene graph for
     * compositions
     *
     * @example
     * let cc = new Compositor(document.getElementById('myCanvas'));
     */
    constructor(canvas) {
        super();
        /**
         * The x coordinate of the mouse position within the canvas
         */
        this.mouseX = 0;
        /**
         * The y coordinate of the mouse position within the canvas
         */
        this.mouseY = 0;
        /**
         * The framerate of the animation loop
         */
        this.framerate = 0;
        /**
         * Any left padding and border added to the canvas must be known to calculate mouse position
         */
        this._leftPadding = 0;
        /**
         * Any top padding and border added to the canvas must be known to calculate mouse position
         */
        this._topPadding = 0;
        /**
         * The timestamp of the current loop of animation
         */
        this._currentTime = 0;
        /**
         * The timestamp of the last frame drawn by the animation loop
         */
        this._lastFrameTimestamp = 0;
        this.canvas = canvas;
        this.scene = new composition_1.default(this.canvas.width, this.canvas.height);
        let context = this.canvas.getContext('bitmaprenderer', { alpha: false, desynchronized: true });
        if (!context) {
            throw new Error(`The root rendering context could not be created.`);
        }
        this.context = context;
        //acquire the padding on the canvas – this is necessary to properly
        //locate the mouse position
        //TODO: determine if border-box affects this, and adjust accordingly
        let style = window.getComputedStyle(this.canvas);
        let borderLeft = style.getPropertyValue('border-left') ? parseFloat(style.getPropertyValue('border-left')) : 0;
        let paddingLeft = style.getPropertyValue('padding-left') ? parseFloat(style.getPropertyValue('padding-left')) : 0;
        let borderTop = style.getPropertyValue('border-top') ? parseFloat(style.getPropertyValue('border-top')) : 0;
        let paddingTop = style.getPropertyValue('padding-top') ? parseFloat(style.getPropertyValue('padding-top')) : 0;
        this._leftPadding = borderLeft + paddingLeft;
        this._topPadding = borderTop + paddingTop;
        // add event listeners
        this.canvas.addEventListener('mouseup', (e) => {
            this._handleMouseUp(e);
            this.dispatchEvent(new Event('mouseup', e));
        });
        this.canvas.addEventListener('mousedown', (e) => {
            this._handleMouseDown(e);
            this.dispatchEvent(new Event('mousedown', e));
        });
        this.canvas.addEventListener('mousemove', (e) => {
            this._handleMouseMove(e);
            this.dispatchEvent(new Event('mousemove', e));
        });
        this.canvas.addEventListener('mouseout', (e) => {
            this._handleMouseOut(e);
            this.dispatchEvent(new Event('mouseout', e));
        });
        this.canvas.addEventListener('click', (e) => {
            this._handleClick(e);
            this.dispatchEvent(new Event('click', e));
        });
        // this.addEventListener('keyup', (e) => {
        //   //
        // });
        // this.addEventListener('keydown', (e) => {
        //   //
        // });
        // this.addEventListener('keypress', (e) => {
        //   //
        // });
        // kick off the animation loop
        this._animationLoop();
    }
    /**
     * The animation loop for this instance of Compositor.
     * Upon receipt of the animation frame from `requestAnimationFrame`, the loop will check
     * whether enough time has passed to redraw for the target framerate.
     * It will only draw if somewhere along the scene graph, an object needs updating.
     * There is no need to invoke this directly, the constructor will do it.
     */
    _animationLoop() {
        window.requestAnimationFrame(this._animationLoop.bind(this));
        this._currentTime = +new Date();
        //set maximum of 60 fps and only redraw if necessary
        if ( /*this._currentTime - this._lastFrameTimestamp >= this._targetFPS &&*/this.scene.dirty) {
            //this._lastRenderTime = +new Date();
            //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.scene.draw(this.scene);
            if (this.scene.autoResizeTargetCanvas && (this.canvas.width !== this.scene.width || this.canvas.height !== this.scene.height)) {
                this.canvas.width = this.scene.width;
                this.canvas.height = this.scene.height;
            }
            this.context.transferFromImageBitmap(this.scene.transferToImageBitmap());
            //this.scene.draw(this.scene); // the scene draws onto itself
        }
        this.framerate = Math.round(1000 / (this._currentTime - this._lastFrameTimestamp));
        this._lastFrameTimestamp = +new Date();
    }
    /**
     * bridge the mouse up event on the canvas to the
     * the objects in the scene graph
     */
    _handleMouseUp(e) {
        e.preventDefault();
        let x = e.offsetX - this._leftPadding;
        let y = e.offsetY - this._topPadding;
        //pass through x and y to propagated events
        //e.canvasX = x;
        //e.canvasY = y;
        // for (let c of this.scene.children) {
        //   c.dispatchEvent(e);
        // }
        let clickedObject = this.scene.childAt(x, y);
        return clickedObject; //?.dispatchEvent(e);
    }
    /**
     * bridge the mouse down event on the canvas to the
     * the objects in the scene graph
     */
    _handleMouseDown(e) {
        e.preventDefault();
        let x = e.offsetX - this._leftPadding;
        let y = e.offsetY - this._topPadding;
        //pass through x and y to propagated events
        // e.canvasX = x;
        // e.canvasY = y;
        let clickedObject = this.scene.childAt(x, y);
        return clickedObject; //?.dispatchEvent(e);
    }
    /**
     * bridge the mouse move event on the canvas to the
     * the objects in the scene graph
     */
    _handleMouseMove(e) {
        e.preventDefault();
        this.mouseX = e.offsetX - this._leftPadding;
        this.mouseY = e.offsetY - this._topPadding;
        // for (let c of this.scene.children) {
        //   c?.dispatchEvent(e);
        // }
    }
    /**
     * bridge the click event on the canvas to the
     * the objects in the scene graph
     */
    _handleClick(e) {
        e.preventDefault();
        let x = e.offsetX - this._leftPadding;
        let y = e.offsetY - this._topPadding;
        //pass through x and y to propagated events
        // e.canvasX = x;
        // e.canvasY = y;
        let clickedObject = this.scene.childAt(x, y);
        return clickedObject; //?.dispatchEvent(e);
    }
    /**
     * bridge the mouse out event on the canvas to the
     * the objects in the scene graph
     */
    _handleMouseOut(e) {
        e.preventDefault();
        // for (let c of this.scene.children) {
        //   c?.dispatchEvent(e);
        // }
    }
}
exports.default = Compositor;
//# sourceMappingURL=compositor.js.map