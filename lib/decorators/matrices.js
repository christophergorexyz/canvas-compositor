"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validMultiplicationDimensions = exports.sameDimensions = void 0;
// Check if matrices have the same dimensions
function sameDimensions() {
    return function (_target, _propertyKey, descriptor) {
        const originalFunction = descriptor.value;
        descriptor.value = function (...args) {
            if (!args.every((arg) => arg.length === args[0].length && arg[0].length === args[0][0].length)) {
                throw new Error("Matrices must have the same dimensions.");
            }
            return originalFunction.apply(this, args);
        };
    };
}
exports.sameDimensions = sameDimensions;
// Check if matrix multiplication dimensions are valid
function validMultiplicationDimensions() {
    return function (_target, _propertyKey, descriptor) {
        const originalFunction = descriptor.value;
        descriptor.value = function (m1, m2) {
            if (m1[0].length !== m2.length) {
                throw new Error("Number of columns in the first matrix must be equal to the number of rows in the second matrix.");
            }
            return originalFunction.apply(this, [m1, m2]);
        };
    };
}
exports.validMultiplicationDimensions = validMultiplicationDimensions;
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
//# sourceMappingURL=matrices.js.map