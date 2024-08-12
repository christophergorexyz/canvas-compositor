"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matrix = void 0;
const matrices_1 = require("../decorators/matrices");
class Matrix extends Array {
    constructor(data) {
        super(...data.flat());
        this._data = data;
        this.rows = data.length;
        this.cols = data[0].length;
    }
    get data() {
        return this._data;
    }
    get(row, col) {
        return this[row * this.cols + col];
    }
    set(row, col, value) {
        this[row * this.cols + col] = value;
        this._data[row][col] = value;
    }
    static add(m1, m2) {
        m1 = m1 instanceof Matrix ? m1 : new Matrix(m1);
        m2 = m2 instanceof Matrix ? m2 : new Matrix(m2);
        return Matrix.fromArray(m1.map((val, i) => val + m2[i]), m1.rows, m1.cols);
    }
    add(matrix) {
        return Matrix.add(this, matrix instanceof Matrix ? matrix : new Matrix(matrix));
    }
    static subtract(m1, m2) {
        m1 = m1 instanceof Matrix ? m1 : new Matrix(m1);
        m2 = m2 instanceof Matrix ? m2 : new Matrix(m2);
        return Matrix.fromArray(m1.map((val, i) => val - m2[i]), m1.rows, m1.cols);
    }
    subtract(matrix) {
        return Matrix.subtract(this, matrix instanceof Matrix ? matrix : new Matrix(matrix));
    }
    static multiply(m1, m2) {
        m1 = m1 instanceof Matrix ? m1 : new Matrix(m1);
        m2 = m2 instanceof Matrix ? m2 : new Matrix(m2);
        if (m1.cols !== m2.rows)
            throw new Error("Invalid dimensions for matrix multiplication.");
        let result = [];
        for (let i = 0; i < m1.length; i++) {
            for (let j = 0; j < m2.cols; j++) {
                for (let k = 0; k < m1.cols; k++) {
                    result.push(m1.get(i, k) * m2.get(k, j));
                }
            }
        }
        return Matrix.fromArray(result, m1.rows, m2.cols);
    }
    multiply(matrix) {
        return Matrix.multiply(this, matrix instanceof Matrix ? matrix : new Matrix(matrix));
    }
    static hadamard(m1, m2) {
        m1 = m1 instanceof Matrix ? m1 : new Matrix(m1);
        m2 = m2 instanceof Matrix ? m2 : new Matrix(m2);
        return Matrix.fromArray(m1.map((val, i) => val * m2[i]), m1.rows, m1.cols);
    }
    hadamard(matrix) {
        matrix = matrix instanceof Matrix ? matrix : new Matrix(matrix);
        return Matrix.hadamard(this, matrix);
    }
    static transpose(m) {
        m = m instanceof Matrix ? m : new Matrix(m);
        let result = [];
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
    static fromArray(array, rows, cols) {
        if (rows * cols !== array.length)
            throw new Error("Array length must be equal to rows * cols.");
        let data = [];
        while (rows--) {
            data.unshift(array.slice(rows * cols, rows * cols + cols));
        }
        return new Matrix(data);
    }
    toArray() {
        return Array.from(this);
    }
    toString() {
        let maxWholeDigits = 0;
        let maxDecimalDigits = 0;
        return Array.from(this).map((val) => {
            var _a;
            const [wholeDigits, decimalDigits] = val.toString().split('.');
            maxWholeDigits = Math.max(maxWholeDigits, wholeDigits.length);
            maxDecimalDigits = Math.max(maxDecimalDigits, (_a = decimalDigits === null || decimalDigits === void 0 ? void 0 : decimalDigits.length) !== null && _a !== void 0 ? _a : 0);
            return [wholeDigits, decimalDigits];
        }).map(([wholeDigits, decimalDigits]) => { var _a; return [wholeDigits.padStart(maxWholeDigits, ' '), (_a = decimalDigits === null || decimalDigits === void 0 ? void 0 : decimalDigits.padEnd(maxDecimalDigits, '0')) !== null && _a !== void 0 ? _a : '']; })
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
            }
            else {
                acc += ', ';
            }
            return acc;
        }, '');
    }
}
exports.Matrix = Matrix;
__decorate([
    (0, matrices_1.sameDimensions)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Matrix, "add", null);
__decorate([
    (0, matrices_1.sameDimensions)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Matrix, "subtract", null);
__decorate([
    (0, matrices_1.validMultiplicationDimensions)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Matrix, "multiply", null);
__decorate([
    (0, matrices_1.sameDimensions)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Matrix, "hadamard", null);
;
//# sourceMappingURL=matrix.js.map