import { Vector } from '../linear-algebra/vector';

type PointLike = Vector | [number, number] | number[];

function asVector(point: PointLike): Vector {
  return point instanceof Vector ? point : new Vector([point[0] ?? 0, point[1] ?? 0]);
}

/**
 * A 2D line represented by an anchor point and a direction vector.
 */
export default class Line {
  readonly p1: Vector;
  readonly direction: Vector;
  readonly p2: Vector;

  constructor(anchor: PointLike, direction: PointLike) {
    this.p1 = asVector(anchor);
    this.direction = asVector(direction);
    this.p2 = Vector.add(this.p1, this.direction);
  }

  intersectionWith(line: Line): Vector | null {
    return Line.intersection(this, line);
  }

  static intersection(l1: Line, l2: Line): Vector | null {
    const x1 = l1.p1[0];
    const x2 = l1.p2[0];
    const x3 = l2.p1[0];
    const x4 = l2.p2[0];
    const y1 = l1.p1[1];
    const y2 = l1.p2[1];
    const y3 = l2.p1[1];
    const y4 = l2.p2[1];

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denominator === 0) {
      return null;
    }

    const xNumerator = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
    const yNumerator = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);

    return new Vector([xNumerator / denominator, yNumerator / denominator]);
  }
}
