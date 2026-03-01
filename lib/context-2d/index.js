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
exports.TextUtilities = exports.TextDefaults = exports.Text = exports.Rectangle = exports.Polygon = exports.Picture = exports.Line = exports.Ellipse = exports.Bezier = exports.Composition = exports.Component = exports.Circle = void 0;
var circle_1 = require("./circle");
Object.defineProperty(exports, "Circle", { enumerable: true, get: function () { return __importDefault(circle_1).default; } });
var component_1 = require("./component");
Object.defineProperty(exports, "Component", { enumerable: true, get: function () { return __importDefault(component_1).default; } });
var composition_1 = require("./composition");
Object.defineProperty(exports, "Composition", { enumerable: true, get: function () { return __importDefault(composition_1).default; } });
var bezier_1 = require("./bezier");
Object.defineProperty(exports, "Bezier", { enumerable: true, get: function () { return __importDefault(bezier_1).default; } });
var ellipse_1 = require("./ellipse");
Object.defineProperty(exports, "Ellipse", { enumerable: true, get: function () { return __importDefault(ellipse_1).default; } });
var line_1 = require("./line");
Object.defineProperty(exports, "Line", { enumerable: true, get: function () { return __importDefault(line_1).default; } });
var picture_1 = require("./picture");
Object.defineProperty(exports, "Picture", { enumerable: true, get: function () { return __importDefault(picture_1).default; } });
var polygon_1 = require("./polygon");
Object.defineProperty(exports, "Polygon", { enumerable: true, get: function () { return __importDefault(polygon_1).default; } });
var rectangle_1 = require("./rectangle");
Object.defineProperty(exports, "Rectangle", { enumerable: true, get: function () { return __importDefault(rectangle_1).default; } });
var text_1 = require("./text");
Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return __importDefault(text_1).default; } });
exports.TextDefaults = __importStar(require("./text-defaults"));
exports.TextUtilities = __importStar(require("./text-utilities"));
//# sourceMappingURL=index.js.map