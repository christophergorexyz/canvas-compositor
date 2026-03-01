"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("../linear-algebra/vector");
function asVector(point) {
    var _a, _b;
    return point instanceof vector_1.Vector ? point : new vector_1.Vector([(_a = point[0]) !== null && _a !== void 0 ? _a : 0, (_b = point[1]) !== null && _b !== void 0 ? _b : 0]);
}
/**
 * A 2D line represented by an anchor point and a direction vector.
 */
class Line {
    constructor(anchor, direction) {
        this.p1 = asVector(anchor);
        this.direction = asVector(direction);
        this.p2 = vector_1.Vector.add(this.p1, this.direction);
    }
    intersectionWith(line) {
        return Line.intersection(this, line);
    }
    static intersection(l1, l2) {
        const x1 = l1.p1[0];
        const x2 = l1.p2[0];
        const x3 = l2.p1[0];
        const x4 = l2.p2[0];
        const y1 = l1.p1[1];
        const y2 = l1.p2[1];
        const y3 = l2.p1[1];
        const y4 = l2.p2[1];
        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (denominator === 0) {
            return null;
        }
        const xNumerator = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
        const yNumerator = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
        return new vector_1.Vector([xNumerator / denominator, yNumerator / denominator]);
    }
}
exports.default = Line;
//# sourceMappingURL=line.js.map