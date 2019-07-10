"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bezier = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

var _vectorious = require("vectorious");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

//uhh... i looked up *SO* much stuff on this, and even tried to work out the math myself,
//but this is ridiculous - where does this come from?
function _cubicBezier(start, c1, c2, end, t) {
  return start * (1 - t) * (1 - t) * (1 - t) + 3 * c1 * t * (1 - t) * (1 - t) + 3 * c2 * t * t * (1 - t) + end * t * t * t;
}

function _getExtremes(start, c1, c2, end) {
  var a = 3 * end - 9 * c2 + 9 * c1 - 3 * start;
  var b = 6 * c2 - 12 * c1 + 6 * start;
  var c = 3 * c1 - 3 * start;
  var solutions = [];
  var localExtrema = []; //"discriminant"

  var disc = b * b - 4 * a * c;

  if (disc >= 0) {
    if (!Math.abs(a) > 0 && Math.abs(b) > 0) {
      solutions.push(-c / b);
    } else if (Math.abs(a) > 0) {
      solutions.push((-b + Math.sqrt(disc)) / (2 * a));
      solutions.push((-b - Math.sqrt(disc)) / (2 * a));
    } else {
      throw new Error("no solutions!?!?!");
    }

    for (var _i = 0, _solutions = solutions; _i < _solutions.length; _i++) {
      var t = _solutions[_i];

      if (0 <= t && t <= 1) {
        localExtrema.push(_cubicBezier(start, c1, c2, end, t));
      }
    }
  }

  localExtrema.push(start, end);
  return localExtrema;
}

var Bezier =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Bezier, _PrimitiveComponent);

  function Bezier(options) {
    var _this;

    _classCallCheck(this, Bezier);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Bezier).call(this, options));
    var start = new _vectorious.Vector([options.start.x, options.start.y]);
    var end = new _vectorious.Vector([options.end.x, options.end.y]);
    var control1 = new _vectorious.Vector([options.control1.x, options.control1.y]);
    var control2 = new _vectorious.Vector([options.control2.x, options.control2.y]);
    _this._boundingBox = null;
    _this._boundingBoxNeedsUpdate = true;

    var xExtrema = _getExtremes(start.x, control1.x, control2, end.x);

    var yExtrema = _getExtremes(start.y, control1.y, control2.y, end.y);

    _set(_getPrototypeOf(Bezier.prototype), "d", new _vectorious.Vector([Math.min.apply(null, xExtrema), Math.min.apply(null, yExtrema)]), _assertThisInitialized(_this), true);

    _this._normalizationVector = _this.d;
    _this._start = _vectorious.Vector.subtract(start, _this._normalizationVector);
    _this._end = _vectorious.Vector.subtract(end, _this._normalizationVector);
    _this._control1 = _vectorious.Vector.subtract(control1, _this._normalizationVector);
    _this._control2 = _vectorious.Vector.subtract(control2, _this._normalizationVector);
    return _this;
  }

  _createClass(Bezier, [{
    key: "render",
    value: function render() {
      _Renderer.Renderer.drawBezier(this._start, this._end, this._control1, this._control2, this._prerenderingContext, this.style);
    }
  }, {
    key: "boundingBox",
    get: function get() {
      //if (this._boundingBox === null || this._boundingBoxNeedsUpdate) {
      var lineWidth = this.style.lineWidth;
      var offset = this.offset;

      var start = _vectorious.Vector.add(this._start, this.offset);

      var control1 = _vectorious.Vector.add(this._control1, this.offset);

      var control2 = _vectorious.Vector.add(this._control2, this.offset);

      var end = _vectorious.Vector.add(this._end, this.offset);

      var xExtrema = _getExtremes(start.x, control1.x, control2, end.x);

      var yExtrema = _getExtremes(start.y, control1.y, control2.y, end.y);

      this._boundingBox = {
        top: Math.min.apply(null, yExtrema) - lineWidth,
        right: Math.max.apply(null, xExtrema) + lineWidth,
        bottom: Math.max.apply(null, yExtrema) + lineWidth,
        left: Math.min.apply(null, xExtrema) - lineWidth
      };
      this._boundingBoxNeedsUpdate = false; //}

      return this._boundingBox;
    }
  }]);

  return Bezier;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Bezier = Bezier;
//# sourceMappingURL=Bezier.js.map