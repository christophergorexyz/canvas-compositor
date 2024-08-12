"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("./component"));
/**
 * A rectangle
 */
class Rectangle extends component_1.default {
    constructor(width, height = width, options) {
        super(width, height);
        this.path.rect(this.displacement[0], this.displacement[1], width, height);
    }
    /**
     * render the rectangle
     * @override
     */
    render() {
        this.context.fill(this.path);
        this.context.stroke(this.path);
    }
}
exports.default = Rectangle;
//# sourceMappingURL=rectangle.js.map