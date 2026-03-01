"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("./component"));
const TextDefaults = __importStar(require("./text-defaults"));
const text_utilities_1 = require("./text-utilities");
function getMeasureContext() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('CanvasRenderingContext2D could not be created for text measurement');
    }
    return context;
}
/**
 * A text component.
 */
class Text extends component_1.default {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const fontString = (0, text_utilities_1.formatFontString)((_a = options.fontStyle) !== null && _a !== void 0 ? _a : TextDefaults.FONT_STYLE, (_b = options.fontVariant) !== null && _b !== void 0 ? _b : TextDefaults.FONT_VARIANT, (_c = options.fontWeight) !== null && _c !== void 0 ? _c : TextDefaults.FONT_WEIGHT, (_d = options.fontSize) !== null && _d !== void 0 ? _d : TextDefaults.FONT_SIZE, (_e = options.lineHeight) !== null && _e !== void 0 ? _e : TextDefaults.LINE_HEIGHT, (_f = options.fontFamily) !== null && _f !== void 0 ? _f : TextDefaults.FONT_FAMILY);
        const context = getMeasureContext();
        const metrics = (0, text_utilities_1.measureText)(options.text, context, { font: fontString });
        const textHeight = (0, text_utilities_1.getTextHeight)(fontString);
        const width = Math.max(1, Math.ceil(metrics.width));
        const height = Math.max(1, Math.ceil(textHeight.height));
        super(width, height, options);
        this.text = options.text;
        this.fontSize = (_g = options.fontSize) !== null && _g !== void 0 ? _g : TextDefaults.FONT_SIZE;
        this.fontFamily = (_h = options.fontFamily) !== null && _h !== void 0 ? _h : TextDefaults.FONT_FAMILY;
        this.fontStyle = (_j = options.fontStyle) !== null && _j !== void 0 ? _j : TextDefaults.FONT_STYLE;
        this.fontVariant = (_k = options.fontVariant) !== null && _k !== void 0 ? _k : TextDefaults.FONT_VARIANT;
        this.fontWeight = (_l = options.fontWeight) !== null && _l !== void 0 ? _l : TextDefaults.FONT_WEIGHT;
        this.lineHeight = (_m = options.lineHeight) !== null && _m !== void 0 ? _m : TextDefaults.LINE_HEIGHT;
        this.textAlign = (_o = options.textAlign) !== null && _o !== void 0 ? _o : TextDefaults.TEXT_ALIGN;
        this.textBaseline = (_p = options.textBaseline) !== null && _p !== void 0 ? _p : TextDefaults.TEXT_BASELINE;
        this.updateBoundsPath();
    }
    get fontString() {
        return (0, text_utilities_1.formatFontString)(this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.lineHeight, this.fontFamily);
    }
    updateTextStyle(context = this.context) {
        context.font = this.fontString;
        context.textAlign = this.textAlign;
        context.textBaseline = this.textBaseline;
    }
    updateBoundsPath() {
        this.path.rect(0, 0, this.width, this.height);
    }
    render() {
        this.updateTextStyle();
        const textHeight = (0, text_utilities_1.getTextHeight)(this.fontString);
        this.context.fillText(this.text, 0, textHeight.ascent);
    }
}
exports.default = Text;
//# sourceMappingURL=text.js.map