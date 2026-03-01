"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("./component"));
/**
 * A circle
 */
class Circle extends component_1.default {
    constructor(radius, options) {
        const diameter = radius * 2;
        super(diameter, diameter, options);
        this.radius = radius;
        this.path.arc(radius, radius, radius, 0, 2 * Math.PI);
    }
    render() {
        this.context.fill(this.path);
        this.context.stroke(this.path);
    }
}
exports.default = Circle;
//# sourceMappingURL=circle.js.map