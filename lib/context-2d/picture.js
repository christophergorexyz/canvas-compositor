"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("./component"));
/**
 * A drawable image component.
 */
class Picture extends component_1.default {
    constructor(image, options) {
        const width = Math.max(1, Math.ceil(image.width));
        const height = Math.max(1, Math.ceil(image.height));
        super(width, height, options);
        this.image = image;
    }
    render() {
        if (this.image.width > 0 && this.image.height > 0) {
            this.context.drawImage(this.image, 0, 0, this.width, this.height);
        }
    }
}
exports.default = Picture;
//# sourceMappingURL=picture.js.map