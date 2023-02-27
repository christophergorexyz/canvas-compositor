"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _renderer = require("./renderer.mjs");
var _primitiveComponent = _interopRequireDefault(require("./primitive-component.mjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
/**
 * A circle
 */
var Circle = /*#__PURE__*/function (_PrimitiveComponent) {
  _inherits(Circle, _PrimitiveComponent);
  var _super = _createSuper(Circle);
  //TODO: provide details about options for docs - link to a separate page
  /**
   * PrimitiveComponent constructor
   * @param {object} options object settings
   */
  function Circle(options) {
    var _this;
    _classCallCheck(this, Circle);
    _this = _super.call(this, options);
    /**
     * the radius of the circle
     * @type {number}
     */
    _this.radius = options.radius || 0;
    return _this;
  }

  /**
   * get the bounding box of the circle;
   * @type {{top:number, left: number, bottom:number, right:number}}
   */
  _createClass(Circle, [{
    key: "boundingBox",
    get: function get() {
      //TODO: possibly memory-inefficient - need to research:
      //strokes are (were?) centered over the mathematical perimeter -
      //so half the stroke laid within the perimeter, and the
      //other half laid outside. for some reason, this doesn't
      //work for (0 < lineWidth < 2.0).
      //
      //it's just a pixel, but when a thousand objects are on screen,
      //that'll make a difference
      var offset = this.offset;
      var scale = this.compoundScale;
      return {
        top: offset.y - (this.radius * scale.scaleHeight + this.style.lineWidth),
        left: offset.x - (this.radius * scale.scaleWidth + this.style.lineWidth),
        bottom: offset.y + this.radius * scale.scaleHeight + this.style.lineWidth,
        right: offset.x + this.radius * scale.scaleWidth + this.style.lineWidth
      };
    }

    /**
     * override the render function for drawing circles specifically
     * @override
     */
  }, {
    key: "render",
    value: function render() {
      //the below is to ensure the proper placement when scaling/line widths are accounted for
      var scale = this.compoundScale;
      var lineWidth = this.style.lineWidth;
      (0, _renderer.drawCircle)(this.radius * scale.scaleWidth + lineWidth, this.radius * scale.scaleHeight + lineWidth, this.radius * scale.scaleWidth, this._prerenderingContext, this.style);
    }

    /**
     * determine whether the point is in the object
     * basically just the pythagorean theorem
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether or not the point is in the object
     */
  }, {
    key: "pointIsInObject",
    value: function pointIsInObject(x, y) {
      var offset = this.offset;

      //don't bother checking the bounding box because
      //pythagorean formula is closed-form
      var a = x - offset.x;
      var b = y - offset.y;
      var c = this.radius;

      //thanks pythagoras~!
      return a * a + b * b <= c * c;
      //use the below when scaling is reimplemented
      /*
      return (
        CanvasObject.prototype.PointIsInObject.call(this, x, y) &&
        Math.pow((x - this.offset.x), 2) / Math.pow((this.radius * this.GlobalScale.scaleWidth), 2) + Math.pow((y - this.offset.y), 2) / Math.pow((this.radius * this.GlobalScale.scaleHeight), 2) <= 1
      );*/
    }
  }]);
  return Circle;
}(_primitiveComponent["default"]);
exports["default"] = Circle;
//# sourceMappingURL=circle.js.map