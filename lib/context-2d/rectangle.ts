import Component, { ComponentOptions } from './component';

/**
 * A rectangle
 */
export default class Rectangle extends Component {
  constructor(width: number, height = width, options?: ComponentOptions) {
    super(width, height, options);

    this.path.rect(0, 0, width, height);
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
