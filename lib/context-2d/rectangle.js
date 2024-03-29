"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("./component"));
const ts_matrix_1 = require("ts-matrix");
/**
 * A rectangle
 */
class Rectangle extends component_1.default {
    constructor() {
        super(...arguments);
        this.size = new ts_matrix_1.Vector([0, 0]);
    }
    /**
     * get the bounding box of the rectangle
     */
    get boundingBox() {
        let offset = this.offset;
        let compoundScale = this.compoundScale;
        return {
            top: offset.at(1) - (this.context.lineWidth),
            left: offset.at(0) - (this.context.lineWidth),
            bottom: offset.at(1) + (compoundScale.at(1) * this.height) + (this.context.lineWidth),
            right: offset.at(0) + (compoundScale.at(0) * this.width) + (this.context.lineWidth)
        };
    }
    /**
     * render the rectangle
     * @override
     */
    render() {
        let [scaleWidth, scaleHeight] = [this.compoundScale.at(0), this.compoundScale.at(1)];
        this.context.rect(this.context.lineWidth, this.context.lineWidth, this.width * scaleWidth, this.height * scaleHeight);
        this.context.fill();
        this.context.stroke();
    }
}
exports.default = Rectangle;
//# sourceMappingURL=rectangle.js.map