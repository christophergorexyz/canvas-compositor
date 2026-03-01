import { Vector } from '../linear-algebra/vector';
import Component, { ComponentOptions } from './component';

type PointLike = Vector | [number, number] | number[];

function asVector(point: PointLike): Vector {
  return point instanceof Vector ? point : new Vector([point[0] ?? 0, point[1] ?? 0]);
}

function cubicBezier(start: number, c1: number, c2: number, end: number, t: number) {
  return start * (1 - t) * (1 - t) * (1 - t)
    + 3 * c1 * t * (1 - t) * (1 - t)
    + 3 * c2 * t * t * (1 - t)
    + end * t * t * t;
}

function getExtremes(start: number, c1: number, c2: number, end: number) {
  const a = 3 * end - 9 * c2 + 9 * c1 - 3 * start;
  const b = 6 * c2 - 12 * c1 + 6 * start;
  const c = 3 * c1 - 3 * start;

  const extrema: number[] = [start, end];
  const disc = b * b - 4 * a * c;

  if (disc < 0) {
    return extrema;
  }

  const solutions: number[] = [];
  if (Math.abs(a) > 0) {
    const sqrtDisc = Math.sqrt(disc);
    solutions.push((-b + sqrtDisc) / (2 * a));
    solutions.push((-b - sqrtDisc) / (2 * a));
  } else if (Math.abs(b) > 0) {
    solutions.push(-c / b);
  }

  for (const t of solutions) {
    if (t >= 0 && t <= 1) {
      extrema.push(cubicBezier(start, c1, c2, end, t));
    }
  }

  return extrema;
}

export interface BezierOptions extends ComponentOptions {
  start: PointLike;
  end: PointLike;
  control1: PointLike;
  control2: PointLike;
}

/**
 * A cubic Bezier curve component.
 */
export default class Bezier extends Component {
  private readonly start: Vector;
  private readonly end: Vector;
  private readonly control1: Vector;
  private readonly control2: Vector;

  constructor(options: BezierOptions) {
    const start = asVector(options.start);
    const end = asVector(options.end);
    const control1 = asVector(options.control1);
    const control2 = asVector(options.control2);

    const xExtrema = getExtremes(start[0], control1[0], control2[0], end[0]);
    const yExtrema = getExtremes(start[1], control1[1], control2[1], end[1]);

    const minX = Math.min(...xExtrema);
    const minY = Math.min(...yExtrema);
    const maxX = Math.max(...xExtrema);
    const maxY = Math.max(...yExtrema);

    const width = Math.max(1, Math.ceil(maxX - minX));
    const height = Math.max(1, Math.ceil(maxY - minY));

    super(width, height, {
      ...options,
      rasterPadding: options.rasterPadding,
      x: options.x ?? minX,
      y: options.y ?? minY,
    });

    const origin = new Vector([minX, minY]);

    this.start = Vector.subtract(start, origin);
    this.end = Vector.subtract(end, origin);
    this.control1 = Vector.subtract(control1, origin);
    this.control2 = Vector.subtract(control2, origin);

    this.path.moveTo(this.start[0], this.start[1]);
    this.path.bezierCurveTo(
      this.control1[0],
      this.control1[1],
      this.control2[0],
      this.control2[1],
      this.end[0],
      this.end[1],
    );
  }

  render() {
    this.context.beginPath();
    this.context.moveTo(this.start[0], this.start[1]);
    this.context.bezierCurveTo(
      this.control1[0],
      this.control1[1],
      this.control2[0],
      this.control2[1],
      this.end[0],
      this.end[1],
    );
    this.context.stroke();
  }
}
