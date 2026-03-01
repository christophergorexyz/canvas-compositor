import Component, { ComponentOptions } from './component';

/**
 * A circle
 */
export default class Circle extends Component {
  readonly radius: number;

  constructor(radius: number, options?: ComponentOptions) {
    const diameter = radius * 2;
    super(diameter, diameter, options);
    this.radius = radius;
    this.path.arc(radius, radius, radius, 0, 2 * Math.PI);
  }

  render() {
    this.context.fill(this.path);
    this.context.stroke(this.path);
  }
}
