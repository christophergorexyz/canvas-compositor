import { drawImage } from './Renderer';
import { PrimitiveComponent } from './PrimitiveComponent';

/**
 * an Image
 */
export class Image extends PrimitiveComponent {
  /**
   * @param {Object} options
   */
  constructor(options) {
    super(options);
    /**
     * unscaledImage the original image
     * @type {window.Image}
     */
    this.unscaledImage = options.image;
  }

  /**
   * get the bounding box
   * @type {{top: number, left: number, bottom: number, right:number}}
   */
  get boundingBox() {
    let compoundScale = this.compoundScale;
    let offset = this.offset;
    return {
      top: offset.y,
      left: offset.x,
      bottom: offset.y + (compoundScale.scaleHeight * this.unscaledImage.height),
      right: offset.x + (compoundScale.scaleWidth * this.unscaledImage.width)
    };
  }

  /**
   * override the render function for images specifically
   * @override
   */
  render() {
    let scale = this.compoundScale;
    let image = new window.Image();
    image.src = this.unscaledImage.src;
    image.width = this.unscaledImage.width * scale.scaleWidth;
    image.height = this.unscaledImage.height * scale.scaleHeight;
    drawImage(0, 0, image, this._prerenderingContext, this.style);
  }
}
