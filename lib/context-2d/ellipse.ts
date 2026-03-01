import Component, { ComponentOptions } from './component';

/**
 * An ellipse
 */
export default class Ellipse extends Component {
  readonly radiusX: number;
  readonly radiusY: number;

  constructor(radiusX: number, radiusY = radiusX, options?: ComponentOptions) {
    super(radiusX * 2, radiusY * 2, options);
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.path.ellipse(radiusX, radiusY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  }

  render() {
    this.context.fill(this.path);
    this.context.stroke(this.path);
  }
}
