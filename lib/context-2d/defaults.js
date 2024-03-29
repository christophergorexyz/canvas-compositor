"use strict";
/**
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEXT_BASELINE = exports.TEXT_ALIGN = exports.FONT = exports.MITER_LIMIT = exports.LINE_JOIN = exports.LINE_WIDTH = exports.LINE_CAP = exports.STROKE_STYLE = exports.FILL_STYLE = void 0;
/**
 * The default color to fill shapes drawn by the canvas context
 */
exports.FILL_STYLE = 'black';
/**
 * The default color to stroke shapes drawn by the canvas context
 */
exports.STROKE_STYLE = 'black';
/**
 * The default line cap style for strokes drawn by the canvas. 'round' chosen to match `LINE_JOIN`, which ensures smooth meshing of vertices
 */
exports.LINE_CAP = 'round';
/**
 * The default stroke width for shapes drawn by the canvas
 */
exports.LINE_WIDTH = 1.0;
/**
 * The default line join style strokes drawn by the canvas. 'round' chosen for smooth meshing of vertices
 */
exports.LINE_JOIN = 'round';
/**
 * The default miter limit ratio for mitered line joins
 */
exports.MITER_LIMIT = 10;
/**
 * The default font for text drawn by the canvas context
 */
exports.FONT = '10px sans-serif';
/**
 * The default text alignment for text drawn by the canvas context
 */
exports.TEXT_ALIGN = 'start';
/**
 * The default text baseline for text drawn by the canvas context
 */
exports.TEXT_BASELINE = 'alphabetic';
//# sourceMappingURL=defaults.js.map