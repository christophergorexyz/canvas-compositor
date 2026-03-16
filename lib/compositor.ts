import Component from './context-2d/component';
import Composition from './context-2d/composition';
import Canvas2DCompositorBackend, { ICompositorBackend } from './rendering/canvas-2d-compositor-backend';

export interface CompositorOptions {
  backend?: ICompositorBackend;
}

/**
 * The Compositor class is the entry-point to usage of the `canvas-compositor`.
 * The application programmer is expected to hand over low-level control of the canvas
 * context to the high-level classes and methods exposed by CanvasCompositor.
 *
 * The Compositor class establishes an event dispatcher, animation loop, and scene graph for
 * compositions.
 */
export default class Compositor extends EventTarget {
  /**
   * the root component for the compositor to draw to
   */
  scene: Composition;

  /**
   * The x coordinate of the mouse position within the canvas
   */
  mouseX: number = 0;

  /**
   * The y coordinate of the mouse position within the canvas
   */
  mouseY: number = 0;

  /**
   * The component last granted "focus"
   */
  targetComponent?: Component;

  /**
   * The framerate of the animation loop
   */
  framerate: number = 0;

  /**
   * Any left padding and border added to the canvas must be known to calculate mouse position
   */
  private _leftPadding: number = 0;

  /**
   * Any top padding and border added to the canvas must be known to calculate mouse position
   */
  private _topPadding: number = 0;

  /**
   * The timestamp of the current loop of animation
   */
  private _currentTime: number = 0;

  /**
   * The timestamp of the last frame drawn by the animation loop
   */
  private _lastFrameTimestamp: number = 0;

  /**
   * The timestamp of the last render performed by the animation loop
   * @type {number}
   */
  //private _lastRenderTime = 0;

  /**
   * The canvas used by the compositor
   */
  readonly canvas: HTMLCanvasElement;

  readonly backend: ICompositorBackend;

  /**
   * The Compositor class establishes an event dispatcher, animation loop, and scene graph for
   * compositions
   *
   * @example
   * let cc = new Compositor(document.getElementById('myCanvas'));
   */
  constructor(canvas: HTMLCanvasElement, options?: CompositorOptions) {
    super();
    this.canvas = canvas;
    this.backend = options?.backend ?? new Canvas2DCompositorBackend(this.canvas);
    this.scene = new Composition(this.canvas.width, this.canvas.height, { renderer: this.backend.componentRenderer });

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
  private _animationLoop() {
    window.requestAnimationFrame(this._animationLoop.bind(this));
    this._currentTime = +new Date();
    //set maximum of 60 fps and only redraw if necessary
    if (this.scene.dirty) {

      this.scene.draw(this.scene);

      if (this.scene.autoResizeTargetCanvas && (this.canvas.width !== this.scene.width || this.canvas.height !== this.scene.height)) {
        this.canvas.width = this.scene.width;
        this.canvas.height = this.scene.height;
      }

      this.backend.present(this.backend.getPresentationOutput(this.scene));
    }
    this.framerate = Math.round(1000 / (this._currentTime - this._lastFrameTimestamp));
    this._lastFrameTimestamp = +new Date();
  }

  /**
   * bridge the mouse up event on the canvas to the
   * the objects in the scene graph
   */
  private _handleMouseUp(e: MouseEvent) {
    e.preventDefault();

    let x = e.offsetX - this._leftPadding;
    let y = e.offsetY - this._topPadding;

    let clickedObject = this.scene.childAt(x, y);
    return clickedObject;
  }

  /**
   * bridge the mouse down event on the canvas to the
   * the objects in the scene graph
   */
  private _handleMouseDown(e: MouseEvent) {
    e.preventDefault();

    let x = e.offsetX - this._leftPadding;
    let y = e.offsetY - this._topPadding;

    let clickedObject = this.scene.childAt(x, y);
    return clickedObject;
  }

  /**
   * bridge the mouse move event on the canvas to the
   * the objects in the scene graph
   */
  private _handleMouseMove(e: MouseEvent) {
    e.preventDefault();
    this.mouseX = e.offsetX - this._leftPadding;
    this.mouseY = e.offsetY - this._topPadding;
  }

  /**
   * bridge the click event on the canvas to the
   * the objects in the scene graph
   */
  private _handleClick(e: MouseEvent) {
    e.preventDefault();

    let x = e.offsetX - this._leftPadding;
    let y = e.offsetY - this._topPadding;

    let clickedObject = this.scene.childAt(x, y);
    return clickedObject;
  }

  /**
   * bridge the mouse out event on the canvas to the
   * the objects in the scene graph
   */
  private _handleMouseOut(e: MouseEvent) {
    e.preventDefault();
  }
}
