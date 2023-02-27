"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Bezier", {
  enumerable: true,
  get: function get() {
    return _bezier["default"];
  }
});
Object.defineProperty(exports, "Circle", {
  enumerable: true,
  get: function get() {
    return _circle["default"];
  }
});
Object.defineProperty(exports, "Composition", {
  enumerable: true,
  get: function get() {
    return _composition["default"];
  }
});
exports.Defaults = void 0;
Object.defineProperty(exports, "Ellipse", {
  enumerable: true,
  get: function get() {
    return _ellipse["default"];
  }
});
Object.defineProperty(exports, "Image", {
  enumerable: true,
  get: function get() {
    return _picture["default"];
  }
});
Object.defineProperty(exports, "Line", {
  enumerable: true,
  get: function get() {
    return _line["default"];
  }
});
Object.defineProperty(exports, "PrimitiveComponent", {
  enumerable: true,
  get: function get() {
    return _primitiveComponent["default"];
  }
});
Object.defineProperty(exports, "Rectangle", {
  enumerable: true,
  get: function get() {
    return _rectangle["default"];
  }
});
Object.defineProperty(exports, "Text", {
  enumerable: true,
  get: function get() {
    return _text["default"];
  }
});
exports.TextDefaults = void 0;
Object.defineProperty(exports, "VectorPath", {
  enumerable: true,
  get: function get() {
    return _vectorPath["default"];
  }
});
var Defaults = _interopRequireWildcard(require("./defaults.mjs"));
exports.Defaults = Defaults;
var TextDefaults = _interopRequireWildcard(require("./text-defaults.mjs"));
exports.TextDefaults = TextDefaults;
var _primitiveComponent = _interopRequireDefault(require("./primitive-component.mjs"));
var _composition = _interopRequireDefault(require("./composition.mjs"));
var _bezier = _interopRequireDefault(require("./bezier.mjs"));
var _circle = _interopRequireDefault(require("./circle.mjs"));
var _ellipse = _interopRequireDefault(require("./ellipse.mjs"));
var _picture = _interopRequireDefault(require("./picture.mjs"));
var _line = _interopRequireDefault(require("./line.mjs"));
var _rectangle = _interopRequireDefault(require("./rectangle.mjs"));
var _text = _interopRequireDefault(require("./text.mjs"));
var _vectorPath = _interopRequireDefault(require("./vector-path.mjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
//# sourceMappingURL=index.js.map