"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _vectorious = require("vectorious");
var _renderer = require("./renderer.mjs");
var _primitiveComponent = _interopRequireDefault(require("./primitive-component.mjs"));
var _line = _interopRequireDefault(require("./line.mjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }
function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new TypeError('failed to set property'); } return value; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
//would name the file 'path', but damn near everything
//relies on the filesystem 'path' module
/**
 * An ordered set of vectors defining a path
 */
var VectorPath = /*#__PURE__*/function (_PrimitiveComponent) {
  _inherits(VectorPath, _PrimitiveComponent);
  var _super = _createSuper(VectorPath);
  /**
   * see PrimitiveComponent for more options
   * @param {Object} options the options for the object
   * @param {Object[]} options.vertices the vertices
   * @param {number} options.vertices[].x the y coordinate for a vertex
   * @param {number} options.vertices[].y the y coordinate for a vertex
   */
  function VectorPath(options) {
    var _this;
    _classCallCheck(this, VectorPath);
    _this = _super.call(this, options);

    /**
     * The sequence of vertices in the path
     */
    _this._vertices = [];
    _this.vertices = options.vertices || [];

    //this.unscaledLineWidth = this.style.lineWidth;

    /**
     * A zeroed bounding box where (left, top) is (0, 0)
     */
    _this._zeroedBoundingBox = null;
    return _this;
  }

  /**
   * get the bounding box for the vertices in the path
   * @type {{top:number, left: number, bottom:number, right:number}}
   */
  _createClass(VectorPath, [{
    key: "boundingBox",
    get: function get() {
      /**
       * The bounding box zeroed
       * @property {number} top always 0
       * @property {number} left always 0
       * @property {number} right the distance from the leftmost vector to the rightmost
       * @property {number} bottom the distance from the topmost vector to the bottommost
       */
      this._zeroedBoundingBox = {
        top: 0,
        left: 0,
        right: this._right - this._left,
        bottom: this._bottom - this._top
      };

      //TODO: reimplement scaling
      return {
        top: this._zeroedBoundingBox.top + this.offset.y - this.style.lineWidth,
        left: this._zeroedBoundingBox.left + this.offset.x - this.style.lineWidth,
        bottom: this._zeroedBoundingBox.bottom + this.offset.y + this.style.lineWidth,
        right: this._zeroedBoundingBox.right + this.offset.x + this.style.lineWidth
      };
    }

    /**
     * retrieve the sequence of vertices in the path
     * @type {Array.<{x: number, y: number }>}
     */
  }, {
    key: "vertices",
    get: function get() {
      return this._vertices;
    }

    /**
     * set the list of vertices
     * @param {Array.<{x: number, y: number }>} verts The list of vertices to be used
     */,
    set: function set(verts) {
      var _this2 = this;
      /**
       * the list of vertices as vectorious Vectors
       * @type {object[]}
       */
      this._vertices = verts.map(function (v) {
        return new _vectorious.Vector([v.x, v.y]);
      });
      var yCoordinates = this.vertices.map(function (v) {
        return v.y;
      });
      var xCoordinates = this.vertices.map(function (v) {
        return v.x;
      });

      //uses `apply` so we can supply the list as a list of arguments
      /**
       * the leftmost x-coordinate
       * @type {number}
       */
      this._left = Math.min.apply(null, xCoordinates);

      /**
       * the topmost y-coordinate
       * @type {number}
       */
      this._top = Math.min.apply(null, yCoordinates);

      /**
       * the rightmost x-coordinate
       * @type {number}
       */
      this._right = Math.max.apply(null, xCoordinates);

      /**
       * the bottommost y-coordinate
       * @type {number}
       */
      this._bottom = Math.max.apply(null, yCoordinates);
      _set(_getPrototypeOf(VectorPath.prototype), "d", new _vectorious.Vector([this._left, this._top]), this, true);

      /**
       * Vertices zeroed against the displacement vector
       */
      this._zeroedVertices = this.vertices.map(function (v) {
        return v.subtract(_this2.d);
      });
      _set(_getPrototypeOf(VectorPath.prototype), "needsDraw", true, this, true);
      _set(_getPrototypeOf(VectorPath.prototype), "needsRender", true, this, true);
    }

    /**
     * determine whether the point is in the object
     * even/odd line intersection test against the outer edge of the line-width
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether or not the point is in the object
     */
  }, {
    key: "pointIsInObject",
    value: function pointIsInObject(x, y) {
      var inside = false;

      //only bother with this check if we already know we're within the bounding box
      if (_get(_getPrototypeOf(VectorPath.prototype), "pointIsInObject", this).call(this, x, y)) {
        //create a line that travels from this point in any direction
        //if it intersects the polygon an odd number of times, it is inside

        //a line can be described by a vertex and a direction
        var l = new _line["default"](new _vectorious.Vector([x, y]), new _vectorious.Vector([1, 0]));
        var compoundScale = this.compoundScale;
        var offset = this.offset;
        for (var i = 0; i < this._zeroedVertices.length; i++) {
          var j = i + 1 >= this._zeroedVertices.length ? 0 : i + 1;

          //TODO: reimplement scaling
          var v = _scaleVectorXY(this._zeroedVertices[i], compoundScale.scaleWidth, compoundScale.scaleHeight).add(offset);
          var w = _scaleVectorXY(this._zeroedVertices[j], compoundScale.scaleWidth, compoundScale.scaleHeight).add(offset);

          //for some reason, the below doesn't work
          //let v = this._zeroedVertices[i].add(offset);

          //let w = this._zeroedVertices[j].add(offset);

          //TODO: determine how to account for lineWidths.
          //it becomes complicated to determine which side of
          //the line forms the outside edge unless you already
          //know you're "inside" the polygon path
          var edgeDirection = _vectorious.Vector.subtract(w, v).normalize();
          var edge = new _line["default"](v, edgeDirection);
          var intersection = edge.intersectionWith(l);

          //if the lines are parallel/colocated, no need to count;
          if (intersection === null) {
            continue;
          }

          //TODO: should replace 0s with epsilons, where epsilon is
          //the threshhold for considering two things as touching/intersecting
          var intersectToTheRight = intersection.x - x >= Number.EPSILON;

          //if the intersection is not to the right, no need to count
          if (!intersectToTheRight) {
            continue;
          }
          var negativeX = edgeDirection.x < -Number.EPSILON;
          var negativeY = edgeDirection.y < -Number.EPSILON;

          //technically speaking, bottom and top should be reversed,
          //since y=0 is the top left corner of the screen - it's
          //just easier to think about it mathematically this way
          var leftVertex = negativeX ? w : v;
          var rightVertex = negativeX ? v : w;
          var topVertex = negativeY ? w : v;
          var bottomVertex = negativeY ? v : w;
          var intersectWithinSegment = intersection.x - leftVertex.x >= Number.EPSILON && rightVertex.x - intersection.x >= Number.EPSILON && intersection.y - topVertex.y >= Number.EPSILON && bottomVertex.y - intersection.y >= Number.EPSILON;
          if (intersectWithinSegment) {
            inside = !inside;
          }
        }
      }
      return inside;
    }

    /**
     * override the render function for drawing vector paths specifically
     * @override
     */
  }, {
    key: "render",
    value: function render() {
      var boundingBox = this.boundingBox;
      var offset = this.offset;
      //let compoundScale = this.compoundScale;
      //zero the vertices (left- and top-most x/y-values should be 0 and 0)
      //TODO: reimplement scaling
      var pathToDraw = this._zeroedVertices.map(function (vertex) {
        return vertex.subtract(new _vectorious.Vector([boundingBox.left, boundingBox.top])).add(offset);
      });
      (0, _renderer.drawPath)(pathToDraw, this._prerenderingContext, this.style);
    }
  }]);
  return VectorPath;
}(_primitiveComponent["default"]); //for scaling a vector
//TODO: reimplement scaling
/**
 * scale the vectors
 * @param {object} vector the vector to scale
 * @param {number} scaleX the amount to scale the x component of the vector
 * @param {number} scaleY the amount to scale the y component of the vector
 */
exports["default"] = VectorPath;
function _scaleVectorXY(vector, scaleX, scaleY) {
  return new _vectorious.Vector([vector.x * scaleX, vector.y * scaleY]);
}
//# sourceMappingURL=vector-path.js.map