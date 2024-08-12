"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawImage = exports.drawText = exports.drawCircle = exports.drawEllipse = exports.drawRectangle = exports.drawBezier = exports.drawPolygon = exports.drawPath = void 0;
/**
 * Draw a path, unclosed, with the given vertices
 * @param {object} vertices the path of vertices to be drawn
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the path
 */
function drawPath(vertices, context) {
    context.beginPath();
    context.moveTo(vertices[0][0], vertices[0][1]);
    for (let v = 1; v < vertices.length; v++) {
        context.lineTo(vertices[v][0], vertices[v][1]);
    }
    context.stroke();
}
exports.drawPath = drawPath;
/**
 * Draw a closed polygon with the given vertices
 * @param {object} vertices the path of vertices to be drawn
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the polygon
 */
function drawPolygon(vertices, context) {
    context.beginPath();
    context.moveTo(vertices[0][0], vertices[0][1]);
    for (let v = 1; v < vertices.length; v++) {
        context.lineTo(vertices[v][0], vertices[v][1]);
    }
    context.closePath();
    context.stroke();
}
exports.drawPolygon = drawPolygon;
/**
 * Draw a Bezier curve
 * @param {object} start the starting vertex
 * @param {object} end the ending vertext
 * @param {object} c1 control point 1
 * @param {object} c2 control point 2
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the curve
 */
function drawBezier(start, end, c1, c2, context) {
    //must `beginPath()` before `moveTo` to get correct starting position
    context.beginPath();
    context.moveTo(start[0], start[1]);
    context.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], end[0], end[1]);
    context.stroke();
    context.closePath();
}
exports.drawBezier = drawBezier;
/**
 * Draw a rectangle
 * @param {number} x the x coordinate of the top let corner
 * @param {number} y the y coordinate of the top left corner
 * @param {number} width the x coordinate
 * @param {number} height the y coordinate
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the rectangle
 */
function drawRectangle(offset, size, context) {
    context.rect(offset[0], offset[1], size[0], size[1]);
    context.fill();
    context.stroke();
}
exports.drawRectangle = drawRectangle;
//TODO: provide support for rotation and startAngle parameters
/**
 * Draw an ellipse
 * @param {number} x the x coordinate of the center of the ellipse
 * @param {number} y the y coordinate of the center of the ellipse
 * @param {number} radius the larger radius of the ellipse
 * @param {number} minorRadius the smaller radius of the ellipse
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the ellipse
 */
function drawEllipse(center, radii, context) {
    var _a;
    context.ellipse(center[0], center[1], radii[0], (_a = radii[1]) !== null && _a !== void 0 ? _a : radii[0], 0, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
}
exports.drawEllipse = drawEllipse;
/**
 * Draw a circle
 * @param {number} x the x coordinate of the center of the circle
 * @param {number} y the y coordinate of the center of the circle
 * @param {number} radius of the circle
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the circle
 */
function drawCircle(x, y, radius, context) {
    context.arc(x, y, radius, 0, 2 * Math.PI);
    //TODO: 2015-03-12 this is currently only supported by chrome & opera
    //context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
}
exports.drawCircle = drawCircle;
/**
 * Draw text
 * @param {number} x the x coordinate of the top let corner
 * @param {number} y the y coordinate of the top left corner
 * @param {string} text the text to be drawn
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the text
 */
function drawText(x, y, text, context) {
    context.fillText(text, x, y);
    //TODO: implement stroke text if specified
}
exports.drawText = drawText;
/**
 * Draw an image
 * @param {number} x the x coordinate of the top let corner
 * @param {number} y the y coordinate of the top left corner
 * @param {object} image the image to be drawn to the canvas
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the image
 */
function drawImage(x, y, image, context) {
    //no reason to draw 0-sized images
    if (image.width > 0 && image.height > 0) {
        context.drawImage(image, x, y, image.width, image.height);
    }
}
exports.drawImage = drawImage;
//# sourceMappingURL=renderer.js.map