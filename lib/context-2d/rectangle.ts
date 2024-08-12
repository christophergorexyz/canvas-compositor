import Component, { ComponentOptions } from './component';
import { Vector } from '../linear-algebra/vector';

/**
 * A rectangle
 */
export default class Rectangle extends Component {
  constructor(width: number, height = width, options?: ComponentOptions) {
    super(width, height);

    this.path.rect(this.displacement[0], this.displacement[1], width, height);
  }

  /**
   * render the rectangle
   * @override
   */
  render() {
    this.context.fill(this.path);
    this.context.stroke(this.path);
  }
}
