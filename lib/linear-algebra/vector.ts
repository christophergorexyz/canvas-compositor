import { sameLength, argsHaveLength } from "../decorators/vectors";

type VectorOperationArgument = number[] | Vector;



export class Vector extends Array<number> {
  constructor(data: number[]) {
    super(...data);
  }

  // math and physics operations 
  add(...args: VectorOperationArgument[]) {
    return Vector.add(this, ...args);
  };

  @sameLength()
  static add(...args: VectorOperationArgument[]) {
    const length = args[0].length;
    return new Vector(args.reduce((acc, val) => acc.map((v, i) => v + val[i]), new Array(length).fill(0)));
  };

  multiply(...args: VectorOperationArgument[]) {
    return Vector.multiply(this, ...args);
  }

  /**
   * entry-wise multiplication of vectors, i.e., hadamard product
   * @param args 
   * @returns 
   */
  @sameLength()
  static multiply(...args: VectorOperationArgument[]) {
    const length = args[0].length;
    return new Vector(args.reduce((acc, val) => acc.map((v, i) => v * val[i]), new Array(length).fill(1)));
  }

  scale(s: number) {
    return Vector.scale(this, s);
  };

  static scale(v: VectorOperationArgument, s: number) {
    v = (v instanceof Vector) ? v : new Vector(v);
    return new Vector(v.map((val) => val * s));
  };

  /**
   * @todo verify that the parameters read the way order of operations would suggest 
   */
  dot(v: VectorOperationArgument) {
    return Vector.dot(this, v);
  };

  @sameLength()
  static dot(v1: VectorOperationArgument, v2: VectorOperationArgument) {
    return v1.reduce((acc, val, i) => acc + val * v2[i], 0);
  }

  magnitude() {
    return Vector.magnitude(this);
  };

  static magnitude(v: VectorOperationArgument) {
    return Math.sqrt(Vector.dot(v, v));
  };

  normal() {
    return Vector.normal(this);
  };

  static normal(v: VectorOperationArgument) {
    const mag = Vector.magnitude(v);
    if (mag === 0) throw new Error("Cannot normalize zero-length vector");
    return new Vector(v.map(val => val / mag));
  };

  subtract(...args: VectorOperationArgument[]) {
    return Vector.subtract(this, ...args);
  };

  @sameLength()
  static subtract(...args: VectorOperationArgument[]) {
    const length = args[0].length;
    return new Vector(args.reduce((acc, val) => acc.map((v, i) => v - val[i]), new Array(length).fill(0)));
  }

  cross(v: VectorOperationArgument) {
    return Vector.cross(this, v);
  };

  @argsHaveLength(3)
  static cross(v1: VectorOperationArgument, v2: VectorOperationArgument) {
    return new Vector([v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]]);
  };

  distance(v: VectorOperationArgument) {
    return Vector.distance(this, v);
  };

  @sameLength()
  static distance(v1: VectorOperationArgument, v2: VectorOperationArgument) {
    const diff = Array.from(v1).map((val, i) => val - v2[i]);
    return Math.sqrt(Vector.dot(diff, diff));
  };

  angleBetween(v: VectorOperationArgument) {
    return Vector.angleBetween(this, v);
  };

  @sameLength()
  static angleBetween(v1: VectorOperationArgument, v2: VectorOperationArgument) {
    const dotProduct = Vector.dot(v1, v2);
    const magnitudes = Vector.magnitude(v1) * Vector.magnitude(v2);
    if (magnitudes === 0) throw new Error("Cannot find angle with zero-length vector");
    return Math.acos(dotProduct / magnitudes);
  };

  radiansBetween(v: VectorOperationArgument) {
    return Vector.radiansBetween(this, v);
  };

  @sameLength()
  static radiansBetween(v1: VectorOperationArgument, v2: VectorOperationArgument) {
    return Vector.angleBetween(v1, v2);
  }

  degreesBetween(v: VectorOperationArgument) {
    return Vector.degreesBetween(this, v);
  };

  @sameLength()
  static degreesBetween(v1: VectorOperationArgument, v2: VectorOperationArgument) {
    return Vector.radiansBetween(v1, v2) * 180 / Math.PI;
  }

  project(v: VectorOperationArgument) {
    return Vector.project(this, v);
  };

  @sameLength()
  static project(v1: VectorOperationArgument, v2: VectorOperationArgument) {
    const scale = Vector.dot(v1, v2) / Vector.dot(v2, v2);
    return Vector.scale(v2, scale);
  };

  // utility functions

  /**
   * 
   * @param args vectors to compare
   * @returns  the minimum and maximum values of the input vectors, respectively
   */
  @sameLength()
  static extrema(...args: VectorOperationArgument[]) {
    const length = args[0].length;
    return args.reduce<[VectorOperationArgument, VectorOperationArgument]>((acc, val) => {
      return [
        acc[0].map((v, i) => Math.min(v, val[i])),
        acc[1].map((v, i) => Math.max(v, val[i]))
      ];
    }, [new Array(length).fill(Infinity), new Array(length).fill(-Infinity)])
      .map(val => new Vector(val));
  }
};