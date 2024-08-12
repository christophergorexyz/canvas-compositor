// Check if matrices have the same dimensions
export function sameDimensions() {
  return function (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction = descriptor.value;
    descriptor.value = function (...args: number[][][]) {
      if (!args.every((arg) => arg.length === args[0].length && arg[0].length === args[0][0].length)) {
        throw new Error("Matrices must have the same dimensions.");
      }
      return originalFunction.apply(this, args);
    };
  };
}

// Check if matrix multiplication dimensions are valid
export function validMultiplicationDimensions() {
  return function (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction = descriptor.value;
    descriptor.value = function (m1: number[][], m2: number[][]) {
      if (m1[0].length !== m2.length) {
        throw new Error("Number of columns in the first matrix must be equal to the number of rows in the second matrix.");
      }
      return originalFunction.apply(this, [m1, m2]);
    };
  };
}

// export function completeMatrix() {
//   return function (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
//     const originalFunction = descriptor.value;
//     descriptor.value = function (m: MatrixRowData) {
//       if (m.length !== m.rows * m.cols) {
//         throw new Error("Matrix is incomplete.");
//       }
//       return originalFunction.apply(this, [m]);
//     };
//   };
// }