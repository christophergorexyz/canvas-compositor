// import { Vector } from 'ts-matrix';

// TODO: these values are convenient, but is it better to just use two vectors?
// is it better if those vectors represent two points, or a displacement and a size?
export interface IBoundingBox {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

// export class BoundingBox {

//   constructor(topLeft?: Vector, bottomRight?: Vector) {
//     this.topLeft = topLeft ?? this.topLeft;
//     this.bottomRight = bottomRight ?? this.topLeft;
//   }

//   topLeft: Vector = new Vector([0, 0]);
//   bottomRight: Vector = new Vector([0, 0]);

//   get top() {
//     return this.topLeft.at(1);
//   }

//   get left() {
//     return this.topLeft.at(0);
//   }

//   get bottom() {
//     return this.bottomRight.at(1);
//   }
//   get right() {

//     return this.bottomRight.at(0);
//   }
// }