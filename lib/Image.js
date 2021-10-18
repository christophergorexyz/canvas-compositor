"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Image = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * an Image
 */
var Image = /*#__PURE__*/function (_PrimitiveComponent) {
  _inherits(Image, _PrimitiveComponent);

  var _super = _createSuper(Image);

  /**
   * @param {Object} options
   */
  function Image(options) {
    var _this;

    _classCallCheck(this, Image);

    _this = _super.call(this, options);
    /**
     * unscaledImage the original image
     * @type {window.Image}
     */

    _this.unscaledImage = options.image;
    return _this;
  }
  /**
   * get the bounding box
   * @type {{top: number, left: number, bottom: number, right:number}}
   */


  _createClass(Image, [{
    key: "boundingBox",
    get: function get() {
      var compoundScale = this.compoundScale;
      var offset = this.offset;
      return {
        top: offset.y,
        left: offset.x,
        bottom: offset.y + compoundScale.scaleHeight * this.unscaledImage.height,
        right: offset.x + compoundScale.scaleWidth * this.unscaledImage.width
      };
    }
    /**
     * override the render function for images specifically
     * @override
     */

  }, {
    key: "render",
    value: function render() {
      var scale = this.compoundScale;
      var image = new window.Image();
      image.src = this.unscaledImage.src;
      image.width = this.unscaledImage.width * scale.scaleWidth;
      image.height = this.unscaledImage.height * scale.scaleHeight;
      (0, _Renderer.drawImage)(0, 0, image, this._prerenderingContext, this.style);
    }
  }]);

  return Image;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Image = Image;
//# sourceMappingURL=Image.js.map