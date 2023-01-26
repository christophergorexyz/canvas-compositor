import { animationFrameScheduler, Subject } from 'rxjs';

export default class Compositor {

  /**
   * The Compositor class establishes an event dispatcher, animation loop, and scene graph for
   * compositions
   *
   * @param {object} canvas This should be a canvas, either from the DOM or an equivalent API
   *
   * @example
   * let compositor = new Compositor(document.getElementById('myCanvas'));
   */
  constructor(canvas) {
    //super();

    /**
     * The canvas used by the compositor
     */
    this._canvas = canvas;

    /**
     * The context used by the compositor
     */
    this._context = this._canvas.getContext('2d');

    //acquire the padding on the canvas – this is necessary to properly
    //locate the mouse position
    //TODO: determine if border-box affects this, and adjust accordingly
    let style = window.getComputedStyle(this._canvas);

    /**
     * The x coordinate of the mouse position within the canvas
     * @type {number}
     */
    this._mouseX = null;

    /**
     * The y coordinate of the mouse position within the canvas
     * @type {number}
     */
    this._mouseY = null;

    let borderLeft = style.getPropertyValue('border-left') ? parseFloat(style.getPropertyValue('border-left')) : 0;
    let paddingLeft = style.getPropertyValue('padding-left') ? parseFloat(style.getPropertyValue('padding-left')) : 0;

    /**
     * Any left padding and border added to the canvas must be known to calculate mouse position
     * @type {number}
     */
    this._leftPadding = borderLeft + paddingLeft;

    let borderTop = style.getPropertyValue('border-top') ? parseFloat(style.getPropertyValue('border-top')) : 0;
    let paddingTop = style.getPropertyValue('padding-top') ? parseFloat(style.getPropertyValue('padding-top')) : 0;

    /**
     * Any top padding and border added to the canvas must be known to calculate mouse position
     * @type {number}
     */
    this._topPadding = borderTop + paddingTop;

    /**
     * The timestamp of the current loop of animation
     * @type {number}
     */
    this._currentTime = 0;

    /**
     * The timestamp of the last frame drawn by the animation loop
     * @type {number}
     */
    this._lastFrameTimestamp = 0;

    /**
     * The timestamp of the last render performed by the animation loop
     * @type {number}
     */
    //this._lastRenderTime = 0;

    /**
     * The object last granted "focus"
     * @type {object}
     */
    this._targetObject = null;

    /**
     * The scene composition. This is the root object to be rendered, everything else rendered must be a child of the scene
     * @type {object}
     */
    //this._scene = new Composition(this.canvas);

    //this._bindEvents();

    this._animationLoop(+new Date);

    /**
     * The framerate of the animation loop
     * @type {number}
     */
    this._framerate = 0;
  }

  _animationLoop(timestamp) {
    animationFrameScheduler.schedule((...args) => this._animationLoop(...args), +new Date);
    console.log('animation');


  }
}
