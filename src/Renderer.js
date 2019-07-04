/**
 * Default style values for the renderer
 */
export const DEFAULTS = {
    //direction: 'inherit',
    fillStyle: 'black',
    //filter: 'none',
    strokeStyle: 'black',
    lineCap: 'round',
    lineWidth: 1.0,
    lineJoin: 'round',
    miterLimit: 10,
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic'
}

//TODO: masking? it looks like this is done in the Composition, but that may be bugged out.

/**
 * A collection of high level static methods for drawing directly to canvas
 *
 */
export class Renderer {
    /**
     * Erase everything drawn on the supplied rectangle for the given context.
     * @param {number} x the x coordinate of the top left corner
     * @param {number} y the y coordinate of the top left corner
     * @param {number} width the x coordinate
     * @param {number} height the y coordinate
     * @param {object} context the 2D Context object for the canvas we're drawing onto
     */
    static clearRect(x, y, width, height, context) {
        context.clearRect(x, y, width, height);
    }

    /**
     * Draw a path, unclosed, with the given vertices
     * @param {object} vertices the path of vertices to be drawn
     * @param {object} context the 2D Context object for the canvas we're drawing onto
     * @param {object} style the style options to be used when drawing the path
     */
    static drawPath(vertices, context, style) {
        Object.assign(context, style);
        context.beginPath();
        context.moveTo(vertices[0].x, vertices[0].y);
        for (let v = 1; v < vertices.length; v++) {
            context.lineTo(vertices[v].x, vertices[v].y);
        }
        context.stroke();
    }

    /**
     * Draw a closed polygon with the given vertices
     * @param {object} vertices the path of vertices to be drawn
     * @param {object} context the 2D Context object for the canvas we're drawing onto
     * @param {object} style the style options to be used when drawing the polygon
     */
    static drawPolygon(vertices, context, style) {
        Object.assign(context, style);
        context.beginPath();
        context.moveTo(vertices[0].x, vertices[0].y);
        for (let v = 1; v < vertices.length; v++) {
            context.lineTo(vertices[v].x, vertices[v].y);
        }
        context.closePath();
        context.stroke();

    }

    static drawBezier(start, end, c1, c2, context, style) {
        Object.assign(context, style);
        //must `beginPath()` before `moveTo` to get correct starting position
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, end.x, end.y);
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
    static drawRectangle(x, y, width, height, context, style) {
        Object.assign(context, style);
        context.rect(x, y, width, height);
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
    static drawEllipse(x, y, radius, minorRadius, context, style) {
        Object.assign(context, style);
        //TODO: 2017-05-22 this is currently not supported by IE
        context.ellipse(x, y, radius, minorRadius, 0, 0, 2 * Math.PI);
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
    static drawCircle(x, y, radius, context, style) {
        Object.assign(context, style);
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
    static drawText(x, y, text, context, style) {
        Object.assign(context, style);
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
    static drawImage(x, y, image, context, style) {
        Object.assign(context, style);
        //no reason to draw 0-sized images
        if (image.width > 0 && image.height > 0) {
            context.drawImage(image, x, y, image.width, image.height);
        }
    }

    //TODO: this should probably be exposed elsewhere/differently
    /**
     * Measure the text
     * @param {string} text the text to be measured
     * @param {object} context the 2D Context object for a canvas - required for measurement to occur, but may be arbitrary
     * @param {object} style the style options to be used when measuring the text
     * @return {object} [TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics) object containing info like Width
     */
    static measureText(text, context, style) {
        Object.assign(context, style);
        return context.measureText(text);
    }
}
