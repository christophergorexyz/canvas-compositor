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
 * A rectangle
 */
var Rectangle = /*#__PURE__*/function (_PrimitiveComponent) {
  _inherits(Rectangle, _PrimitiveComponent);
  var _super = _createSuper(Rectangle);
  /**
   * @param {object} options the options for the object
   */
  function Rectangle(options) {
    var _this;
    _classCallCheck(this, Rectangle);
    _this = _super.call(this, options);
    /**
     * the width of the rectangle
     * @type {number}
     */
    _this.width = options.width || 0;

    /**
     * the height of the rectangle
     * @type {number}
     */
    _this.height = options.height || 0;
    return _this;
  }

  /**
   * get the bounding box of the rectangle
   * @type {{top:number, left:number, bottom:number, right:number}}
   */
  _createClass(Rectangle, [{
    key: "boundingBox",
    get: function get() {
      var offset = this.offset;
      var compoundScale = this.compoundScale;
      return {
        top: offset.y - this.style.lineWidth,
        left: offset.x - this.style.lineWidth,
        bottom: offset.y + compoundScale.scaleHeight * this.height + this.style.lineWidth,
        right: offset.x + compoundScale.scaleWidth * this.width + this.style.lineWidth
      };
    }

    /**
     * render the rectangle
     * @override
     */
  }, {
    key: "render",
    value: function render() {
      var compoundScale = this.compoundScale;
      (0, _renderer.drawRectangle)(this.style.lineWidth, this.style.lineWidth, this.width * compoundScale.scaleWidth, this.height * compoundScale.scaleHeight, this._prerenderingContext, this.style);
    }
  }]);
  return Rectangle;
}(_primitiveComponent["default"]);
exports["default"] = Rectangle;
//# sourceMappingURL=rectangle.js.map