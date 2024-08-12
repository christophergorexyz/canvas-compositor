"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomMatrix = exports.OnesMatrix = exports.ZeroMatrix = exports.IdentityMatrix = exports.ShearMatrix = exports.RotationMatrix = exports.ScaleMatrix = exports.TranslationMatrix = void 0;
const matrix_1 = require("./matrix");
class TranslationMatrix extends matrix_1.Matrix {
    constructor(x, y) {
        super([[1, 0, x], [0, 1, y], [0, 0, 1]]);
    }
}
exports.TranslationMatrix = TranslationMatrix;
class ScaleMatrix extends matrix_1.Matrix {
    constructor(x, y) {
        super([[x, 0, 0], [0, y, 0], [0, 0, 1]]);
    }
}
exports.ScaleMatrix = ScaleMatrix;
class RotationMatrix extends matrix_1.Matrix {
    constructor(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        super([[cos, -sin, 0], [sin, cos, 0,], [0, 0, 1]]);
    }
}
exports.RotationMatrix = RotationMatrix;
class ShearMatrix extends matrix_1.Matrix {
    constructor(x, y) {
        super([[1, x, 0], [y, 1, 0], [0, 0, 1]]);
    }
}
exports.ShearMatrix = ShearMatrix;
class IdentityMatrix extends matrix_1.Matrix {
    constructor(size) {
        super(new Array(size)
            .fill(0)
            .map((_, i) => new Array(size)
            .fill(0)
            .map((_, j) => i == j ? 1 : 0)));
    }
}
exports.IdentityMatrix = IdentityMatrix;
class ZeroMatrix extends matrix_1.Matrix {
    constructor(rows, cols) {
        super(new Array(rows).fill(new Array(cols).fill(0)));
    }
}
exports.ZeroMatrix = ZeroMatrix;
class OnesMatrix extends matrix_1.Matrix {
    constructor(rows, cols) {
        super(new Array(rows).fill(new Array(cols).fill(1)));
    }
}
exports.OnesMatrix = OnesMatrix;
class RandomMatrix extends matrix_1.Matrix {
    constructor(rows, cols) {
        super(new Array(rows).fill(new Array(cols).fill(0).map(() => Math.random())));
    }
}
exports.RandomMatrix = RandomMatrix;
// export class DiagonalMatrix extends Matrix {
//   constructor(data: number[]) {
//     super(data);
//   }
// }
// export class UpperTriangularMatrix extends Matrix {
//   constructor(data: number[]) {
//     super(data, Math.floor(Math.sqrt(data.length) + 1), Math.floor(Math.sqrt(data.length) + 1));
//   }
// }
// export class LowerTriangularMatrix extends Matrix {
//   constructor(data: number[]) {
//     super(data, Math.floor(Math.sqrt(data.length) + 1), Math.floor(Math.sqrt(data.length) + 1));
//   }
// }
// export class SymmetricMatrix extends Matrix {
//   constructor(data: number[]) {
//     super(data, Math.floor(Math.sqrt(data.length) + 1), Math.floor(Math.sqrt(data.length) + 1));
//   }
// }
// export class ToeplitzMatrix extends Matrix {
//   constructor(data: number[]) {
//     super(data, Math.floor(Math.sqrt(data.length)), Math.floor(Math.sqrt(data.length)));
//   }
// }
//https://en.wikipedia.org/wiki/Vandermonde_matrix
// https://en.wikipedia.org/wiki/Companion_matrix
// https://en.wikipedia.org/wiki/Circulant_matrix
// https://en.wikipedia.org/wiki/Hankel_matrix
// https://en.wikipedia.org/wiki/Pascal_matrix
// https://en.wikipedia.org/wiki/Hilbert_matrix
// Fibonacci Matrix ?
//# sourceMappingURL=specialty-matrices.js.map