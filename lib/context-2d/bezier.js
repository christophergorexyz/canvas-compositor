"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("../linear-algebra/vector");
const component_1 = __importDefault(require("./component"));
function asVector(point) {
    var _a, _b;
    return point instanceof vector_1.Vector ? point : new vector_1.Vector([(_a = point[0]) !== null && _a !== void 0 ? _a : 0, (_b = point[1]) !== null && _b !== void 0 ? _b : 0]);
}
function cubicBezier(start, c1, c2, end, t) {
    return start * (1 - t) * (1 - t) * (1 - t)
        + 3 * c1 * t * (1 - t) * (1 - t)
        + 3 * c2 * t * t * (1 - t)
        + end * t * t * t;
}
function getExtremes(start, c1, c2, end) {
    const a = 3 * end - 9 * c2 + 9 * c1 - 3 * start;
    const b = 6 * c2 - 12 * c1 + 6 * start;
    const c = 3 * c1 - 3 * start;
    const extrema = [start, end];
    const disc = b * b - 4 * a * c;
    if (disc < 0) {
        return extrema;
    }
    const solutions = [];
    if (Math.abs(a) > 0) {
        const sqrtDisc = Math.sqrt(disc);
        solutions.push((-b + sqrtDisc) / (2 * a));
        solutions.push((-b - sqrtDisc) / (2 * a));
    }
    else if (Math.abs(b) > 0) {
        solutions.push(-c / b);
    }
    for (const t of solutions) {
        if (t >= 0 && t <= 1) {
            extrema.push(cubicBezier(start, c1, c2, end, t));
        }
    }
    return extrema;
}
/**
 * A cubic Bezier curve component.
 */
class Bezier extends component_1.default {
    constructor(options) {
        var _a, _b;
        const start = asVector(options.start);
        const end = asVector(options.end);
        const control1 = asVector(options.control1);
        const control2 = asVector(options.control2);
        const xExtrema = getExtremes(start[0], control1[0], control2[0], end[0]);
        const yExtrema = getExtremes(start[1], control1[1], control2[1], end[1]);
        const minX = Math.min(...xExtrema);
        const minY = Math.min(...yExtrema);
        const maxX = Math.max(...xExtrema);
        const maxY = Math.max(...yExtrema);
        const width = Math.max(1, Math.ceil(maxX - minX));
        const height = Math.max(1, Math.ceil(maxY - minY));
        super(width, height, Object.assign(Object.assign({}, options), { x: (_a = options.x) !== null && _a !== void 0 ? _a : minX, y: (_b = options.y) !== null && _b !== void 0 ? _b : minY }));
        const origin = new vector_1.Vector([minX, minY]);
        this.start = vector_1.Vector.subtract(start, origin);
        this.end = vector_1.Vector.subtract(end, origin);
        this.control1 = vector_1.Vector.subtract(control1, origin);
        this.control2 = vector_1.Vector.subtract(control2, origin);
        this.path.moveTo(this.start[0], this.start[1]);
        this.path.bezierCurveTo(this.control1[0], this.control1[1], this.control2[0], this.control2[1], this.end[0], this.end[1]);
    }
    render() {
        this.context.stroke(this.path);
    }
}
exports.default = Bezier;
//# sourceMappingURL=bezier.js.map