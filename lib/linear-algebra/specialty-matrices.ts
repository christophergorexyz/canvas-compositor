import { Matrix } from './matrix';

export class TranslationMatrix extends Matrix {
  constructor(x: number, y: number) {
    super([[1, 0, x], [0, 1, y], [0, 0, 1]]);
  }
}

export class ScaleMatrix extends Matrix {
  constructor(x: number, y: number) {
    super([[x, 0, 0], [0, y, 0], [0, 0, 1]]);
  }
}

export class RotationMatrix extends Matrix {
  constructor(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    super([[cos, -sin, 0], [sin, cos, 0,], [0, 0, 1]]);
  }
}

export class ShearMatrix extends Matrix {
  constructor(x: number, y: number) {
    super([[1, x, 0], [y, 1, 0], [0, 0, 1]]);
  }
}

export class IdentityMatrix extends Matrix {
  constructor(size: number) {
    super(new Array(size)
      .fill(0)
      .map((_, i) => new Array(size)
        .fill(0)
        .map((_, j) => i == j ? 1 : 0)));
  }
}

export class ZeroMatrix extends Matrix {
  constructor(rows: number, cols: number) {
    super(new Array(rows).fill(new Array(cols).fill(0)));
  }
}

export class OnesMatrix extends Matrix {
  constructor(rows: number, cols: number) {
    super(new Array(rows).fill(new Array(cols).fill(1)));
  }
}

export class RandomMatrix extends Matrix {
  constructor(rows: number, cols: number) {
    super(new Array(rows).fill(new Array(cols).fill(0).map(() => Math.random())));
  }
}

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


