// import Component from './component';
// import { Vector, VectorData } from '../linear-algebra/vector';

// /**
//  * An ordered set of vectors defining a path
//  */
// export default class Path extends Component {

//   constructor(...path: VectorData[]) {
//     let [min, max] = Vector.extrema(...path);
//     super(max[0] - min[0], max[1] - min[1]);
//     this.offset = 
//   }
//   /**
//    * override the render function for drawing vector paths specifically
//    * @override
//    */
//   render() {
//     this.context.beginPath();
//     this.context.moveTo(this.path[0][0], this.path[0][1]);
//     for (let v = 1; v < this.path.length; v++) {
//       this.context.lineTo(this.path[v][0], this.path[v][1]);
//     }
//     this.context.stroke();
//   }
// }
