import { Vector } from 'ts-matrix';

/**
 * Draw a path, unclosed, with the given vertices
 * @param {object} vertices the path of vertices to be drawn
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the path
 */
export function drawPath(vertices: Vector[], context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
  context.beginPath();
  context.moveTo(vertices[0].at(0), vertices[0].at(1));
  for (let v = 1; v < vertices.length; v++) {
    context.lineTo(vertices[v].at(0), vertices[v].at(1));
  }
  context.stroke();
}

/**
 * Draw a closed polygon with the given vertices
 * @param {object} vertices the path of vertices to be drawn
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the polygon
 */
export function drawPolygon(vertices: Vector[], context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
  context.beginPath();
  context.moveTo(vertices[0].at(0), vertices[0].at(1));
  for (let v = 1; v < vertices.length; v++) {
    context.lineTo(vertices[v].at(0), vertices[v].at(1));
  }
  context.closePath();
  context.stroke();
}

/**
 * Draw a Bezier curve
 * @param {object} start the starting vertex
 * @param {object} end the ending vertext
 * @param {object} c1 control point 1
 * @param {object} c2 control point 2
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the curve
 */
export function drawBezier(start: Vector, end: Vector, c1: Vector, c2: Vector, context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
  //must `beginPath()` before `moveTo` to get correct starting position
  context.beginPath();
  context.moveTo(start.at(0), start.at(1));
  context.bezierCurveTo(c1.at(0), c1.at(1), c2.at(0), c2.at(1), end.at(0), end.at(1));
  context.stroke();
  context.closePath();
}

/**
 * Draw a rectangle
 * @param {number} x the x coordinate of the top let corner
 * @param {number} y the y coordinate of the top left corner
 * @param {number} width the x coordinate
 * @param {number} height the y coordinate
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the rectangle
 */
export function drawRectangle(offset: Vector, size: Vector, context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
  context.rect(offset.at(0), offset.at(1), size.at(0), size.at(1));
  context.fill();
  context.stroke();
}

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
export function drawEllipse(center: Vector, radii: Vector, context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
  context.ellipse(center.at(0), center.at(1), radii.at(0), radii.at(1) ?? radii.at(0), 0, 0, 2 * Math.PI);
  context.fill();
  context.stroke();
}

/**
 * Draw a circle
 * @param {number} x the x coordinate of the center of the circle
 * @param {number} y the y coordinate of the center of the circle
 * @param {number} radius of the circle
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the circle
 */
export function drawCircle(x: number, y: number, radius: number, context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
  context.arc(x, y, radius, 0, 2 * Math.PI);
  //TODO: 2015-03-12 this is currently only supported by chrome & opera
  //context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
  context.fill();
  context.stroke();
}

/**
 * Draw text
 * @param {number} x the x coordinate of the top let corner
 * @param {number} y the y coordinate of the top left corner
 * @param {string} text the text to be drawn
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the text
 */
export function drawText(x: number, y: number, text: string, context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
  context.fillText(text, x, y);
  //TODO: implement stroke text if specified
}

/**
 * Draw an image
 * @param {number} x the x coordinate of the top let corner
 * @param {number} y the y coordinate of the top left corner
 * @param {object} image the image to be drawn to the canvas
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the image
 */
export function drawImage(x: number, y: number, image: HTMLImageElement, context: CanvasRenderingContext2D) {
  //no reason to draw 0-sized images
  if (image.width > 0 && image.height > 0) {
    context.drawImage(image, x, y, image.width, image.height);
  }
}
