import Component from './component';
import { Vector } from 'ts-matrix';

/**
 * A rectangle
 */
export default class Rectangle extends Component {
  size: Vector = new Vector([0, 0]);

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
