"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _rxjs = require("rxjs");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Compositor = /*#__PURE__*/function () {
  /**
   * The Compositor class establishes an event dispatcher, animation loop, and scene graph for
   * compositions
   *
   * @param {object} canvas This should be a canvas, either from the DOM or an equivalent API
   *
   * @example
   * let compositor = new Compositor(document.getElementById('myCanvas'));
   */
  function Compositor(canvas) {
    _classCallCheck(this, Compositor);
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
    var style = window.getComputedStyle(this._canvas);

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
    var borderLeft = style.getPropertyValue('border-left') ? parseFloat(style.getPropertyValue('border-left')) : 0;
    var paddingLeft = style.getPropertyValue('padding-left') ? parseFloat(style.getPropertyValue('padding-left')) : 0;

    /**
     * Any left padding and border added to the canvas must be known to calculate mouse position
     * @type {number}
     */
    this._leftPadding = borderLeft + paddingLeft;
    var borderTop = style.getPropertyValue('border-top') ? parseFloat(style.getPropertyValue('border-top')) : 0;
    var paddingTop = style.getPropertyValue('padding-top') ? parseFloat(style.getPropertyValue('padding-top')) : 0;

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

    this._animationLoop(+new Date());

    /**
     * The framerate of the animation loop
     * @type {number}
     */
    this._framerate = 0;
  }
  _createClass(Compositor, [{
    key: "_animationLoop",
    value: function _animationLoop(timestamp) {
      var _this = this;
      _rxjs.animationFrameScheduler.schedule(function () {
        return _this._animationLoop.apply(_this, arguments);
      }, +new Date());
      console.log('animation');
    }
  }]);
  return Compositor;
}();
exports["default"] = Compositor;
//# sourceMappingURL=Compositor.js.map