"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("../linear-algebra/vector");
const component_1 = __importDefault(require("./component"));
/**
 * A closed polygon path
 */
class Polygon extends component_1.default {
    constructor(points, options) {
        if (!points.length) {
            throw new Error('Polygon requires at least one point');
        }
        const vectors = points.map((point) => point instanceof vector_1.Vector ? point : new vector_1.Vector(point));
        const [min, max] = vector_1.Vector.extrema(...vectors);
        const width = Math.max(1, max[0] - min[0]);
        const height = Math.max(1, max[1] - min[1]);
        super(width, height, options);
        this.points = vectors.map((point) => new vector_1.Vector([
            point[0] - min[0],
            point[1] - min[1],
        ]));
        this.path.moveTo(this.points[0][0], this.points[0][1]);
        for (let index = 1; index < this.points.length; index += 1) {
            this.path.lineTo(this.points[index][0], this.points[index][1]);
        }
        this.path.closePath();
    }
    render() {
        this.context.fill(this.path);
        this.context.stroke(this.path);
    }
}
exports.default = Polygon;
//# sourceMappingURL=polygon.js.map