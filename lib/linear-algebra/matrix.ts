import { sameDimensions, validMultiplicationDimensions } from '../decorators/matrices';

type MatrixOperationArgument = number[][] | Matrix;

export class Matrix extends Array<number> {
  readonly rows: number;
  readonly cols: number;
  private _data: number[][];

  constructor(data: number[][]) {
    super(...data.flat());
    this._data = data;
    this.rows = data.length;
    this.cols = data[0].length;
  }

  get data() {
    return this._data;
  }

  get(row: number, col: number) {
    return this[row * this.cols + col];
  }

  set(row: number, col: number, value: number) {
    this[row * this.cols + col] = value;
    this._data[row][col] = value;
  }

  @sameDimensions()
  static add(m1: MatrixOperationArgument, m2: MatrixOperationArgument) {
    m1 = m1 instanceof Matrix ? m1 : new Matrix(m1);
    m2 = m2 instanceof Matrix ? m2 : new Matrix(m2);
    return Matrix.fromArray(m1.map((val, i) => val + m2[i]), m1.rows, m1.cols);
  }

  add(matrix: MatrixOperationArgument) {
    return Matrix.add(this, matrix instanceof Matrix ? matrix : new Matrix(matrix));
  }

  @sameDimensions()
  static subtract(m1: MatrixOperationArgument, m2: MatrixOperationArgument) {
    m1 = m1 instanceof Matrix ? m1 : new Matrix(m1);
    m2 = m2 instanceof Matrix ? m2 : new Matrix(m2);
    return Matrix.fromArray(m1.map((val, i) => val - m2[i]), m1.rows, m1.cols);
  }

  subtract(matrix: MatrixOperationArgument) {
    return Matrix.subtract(this, matrix instanceof Matrix ? matrix : new Matrix(matrix));
  }

  @validMultiplicationDimensions()
  static multiply(m1: MatrixOperationArgument, m2: MatrixOperationArgument) {
    m1 = m1 instanceof Matrix ? m1 : new Matrix(m1);
    m2 = m2 instanceof Matrix ? m2 : new Matrix(m2);
    if (m1.cols !== m2.rows) throw new Error("Invalid dimensions for matrix multiplication.");
    let result = [] as Array<number>;
    for (let i = 0; i < m1.length; i++) {
      for (let j = 0; j < m2.cols; j++) {
        for (let k = 0; k < m1.cols; k++) {
          result.push(m1.get(i, k) * m2.get(k, j));
        }
      }
    }
    return Matrix.fromArray(result, m1.rows, m2.cols);
  }

  multiply(matrix: MatrixOperationArgument) {
    return Matrix.multiply(this, matrix instanceof Matrix ? matrix : new Matrix(matrix));
  }

  @sameDimensions()
  static hadamard(m1: MatrixOperationArgument, m2: MatrixOperationArgument) {
    m1 = m1 instanceof Matrix ? m1 : new Matrix(m1);
    m2 = m2 instanceof Matrix ? m2 : new Matrix(m2);
    return Matrix.fromArray(m1.map((val, i) => val * m2[i]), m1.rows, m1.cols);
  }

  hadamard(matrix: MatrixOperationArgument) {
    matrix = matrix instanceof Matrix ? matrix : new Matrix(matrix);
    return Matrix.hadamard(this, matrix);
  }

  static transpose(m: MatrixOperationArgument) {
    m = m instanceof Matrix ? m : new Matrix(m);
    let result = [] as Array<number>;
    for (let i = 0; i < m.cols; i++) {
      for (let j = 0; j < m.rows; j++) {
        result.push(m.get(j, i));
      }
    }
    return Matrix.fromArray(result, m.cols, m.rows);
  }

  transpose() {
    return Matrix.transpose(this);
  }

  toRows() {
    return this.data;
  }

  toColumns() {
    return this.transpose().toRows();
  }

  static fromArray(array: number[], rows: number, cols: number) {
    if (rows * cols !== array.length) throw new Error("Array length must be equal to rows * cols.");
    let data = [];
    while (rows--) {
      data.unshift(array.slice(rows * cols, rows * cols + cols));
    }
    return new Matrix(data);
  }

  toArray() {
    return Array.from(this);
  }

  toString(): string {
    let maxWholeDigits = 0;
    let maxDecimalDigits = 0;

    return Array.from(this).map((val) => {
      const [wholeDigits, decimalDigits] = val.toString().split('.');
      maxWholeDigits = Math.max(maxWholeDigits, wholeDigits.length);
      maxDecimalDigits = Math.max(maxDecimalDigits, decimalDigits?.length ?? 0);
      return [wholeDigits, decimalDigits];
    }).map(([wholeDigits, decimalDigits]) => [wholeDigits.padStart(maxWholeDigits, ' '), decimalDigits?.padEnd(maxDecimalDigits, '0') ?? ''])
      .reduce((acc, [wholeDigits, decimalDigits], i) => {
        const row = Math.floor(i / this.cols);
        const col = i % this.cols;
        if (col === 0) {
          acc += "[";
        }

        acc += `${wholeDigits}${(decimalDigits ? '.' + decimalDigits : '')}`;

        if (col === this.cols - 1) {
          acc += ']';
          if (row !== this.rows - 1) {
            acc += '\n';
          }
        } else {
          acc += ', ';
        }
        return acc;

      }, '');
  }
};