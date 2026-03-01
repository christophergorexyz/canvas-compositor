"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("./component"));
/**
 * An ellipse
 */
class Ellipse extends component_1.default {
    constructor(radiusX, radiusY = radiusX, options) {
        super(radiusX * 2, radiusY * 2, options);
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.path.ellipse(radiusX, radiusY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    }
    render() {
        this.context.fill(this.path);
        this.context.stroke(this.path);
    }
}
exports.default = Ellipse;
//# sourceMappingURL=ellipse.js.map