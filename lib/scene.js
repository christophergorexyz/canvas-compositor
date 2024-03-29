"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const composition_1 = __importDefault(require("./context-2d/composition"));
class Scene extends composition_1.default {
    constructor(width, height) {
        super(width, height);
        this.addEventListener('mouseup', (e) => {
        });
        this.addEventListener('mousedown', (e) => {
        });
        this.addEventListener('mousemove', (e) => {
        });
        this.addEventListener('click', (e) => {
        });
        this.addEventListener('mouseout', (e) => {
        });
    }
}
exports.default = Scene;
//# sourceMappingURL=scene.js.map