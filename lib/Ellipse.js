"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ellipse = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * An ellipse
 */
var Ellipse =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Ellipse, _PrimitiveComponent);

  /**
   * @param {object} options options for the ellipse
   * @param {number} options.radius the major (horizontal) radius of the ellipse
   * @param {number} options.minorRadius the minor (vertical) radius of the ellipse
   */
  function Ellipse(options) {
    var _this;

    _classCallCheck(this, Ellipse);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Ellipse).call(this, options));
    /**
     * @type {number} radius the major radius (horizontal) of the ellipse
     */

    _this.radius = options.radius || 0;
    /**
     * @type {number} minorRadius the minor radius (vertical) of the ellipse
     */

    _this.minorRadius = options.minorRadius || _this.radius || 0;
    return _this;
  }
  /**
   * the bounding box for the ellipse
   * @type {{top: number, left: number, bottom: number, right: number}} boundingBox
   */


  _createClass(Ellipse, [{
    key: "render",

    /**
     * override the render function specifically for ellipses
     * @override
     */
    value: function render() {
      var scale = this.compoundScale;
      var lineWidth = this.style.lineWidth; //TODO: work out scaling of major/minor radius
      //this doesn't make sense

      (0, _Renderer.drawEllipse)(this.radius * scale.scaleWidth + lineWidth, this.minorRadius * scale.scaleHeight + lineWidth, this.radius * scale.scaleWidth, this.minorRadius * scale.scaleHeight, this._prerenderingContext, this.style);
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
      var scale = this.compoundScale;
      var offset = this.offset;
      var a = x - offset.x;
      var b = y - offset.y;
      var c1 = this.radius * scale.scaleWidth;
      var c2 = this.minorRadius * scale.scaleHeight; //see: http://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse

      return a * a / (c1 * c1) + b * b / (c2 * c2) <= 1;
    }
  }, {
    key: "boundingBox",
    get: function get() {
      var offset = this.offset;
      var scale = this.compoundScale;
      var lineWidth = this.style.lineWidth;
      return {
        top: offset.y - (this.minorRadius * scale.scaleHeight + lineWidth),
        left: offset.x - (this.radius * scale.scaleWidth + lineWidth),
        bottom: offset.y + this.minorRadius * scale.scaleHeight + lineWidth,
        right: offset.x + this.radius * scale.scaleWidth + lineWidth
      };
    }
  }]);

  return Ellipse;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Ellipse = Ellipse;
//# sourceMappingURL=Ellipse.js.map