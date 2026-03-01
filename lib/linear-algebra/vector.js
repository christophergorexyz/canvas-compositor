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
exports.Vector = exports.isVector = void 0;
const vectors_1 = require("../decorators/vectors");
function isVector(arg) {
    return arg instanceof Vector;
}
exports.isVector = isVector;
class Vector extends Array {
    constructor(data = 0) {
        if (typeof data === 'number') {
            super(data);
            return;
        }
        super(...data);
    }
    // math and physics operations
    add(...args) {
        return Vector.add(this, ...args);
    }
    ;
    static add(...args) {
        const length = args[0].length;
        return new Vector(args.reduce((acc, val) => acc.map((v, i) => v + val[i]), new Array(length).fill(0)));
    }
    ;
    multiply(...args) {
        return Vector.multiply(this, ...args);
    }
    /**
     * entry-wise multiplication of vectors, i.e., hadamard product
     * @param args
     * @returns
     */
    static multiply(...args) {
        const length = args[0].length;
        return new Vector(args.reduce((acc, val) => acc.map((v, i) => v * val[i]), new Array(length).fill(1)));
    }
    scale(s) {
        return Vector.scale(this, s);
    }
    ;
    static scale(v, s) {
        if (!isVector(v))
            v = new Vector(v);
        return new Vector(v.map((val) => val * s));
    }
    ;
    /**
     * @todo verify that the parameters read the way order of operations would suggest
     */
    dot(v) {
        return Vector.dot(this, v);
    }
    ;
    static dot(v1, v2) {
        return v1.reduce((acc, val, i) => acc + val * v2[i], 0);
    }
    magnitude() {
        return Vector.magnitude(this);
    }
    ;
    static magnitude(v) {
        return Math.sqrt(Vector.dot(v, v));
    }
    ;
    normal() {
        return Vector.normal(this);
    }
    ;
    static normal(v) {
        const mag = Vector.magnitude(v);
        if (mag === 0)
            throw new Error("Cannot normalize zero-length vector");
        return new Vector(v.map(val => val / mag));
    }
    ;
    subtract(...args) {
        return Vector.subtract(this, ...args);
    }
    ;
    static subtract(...args) {
        const length = args[0].length;
        return new Vector(args.reduce((acc, val) => acc.map((v, i) => v - val[i]), new Array(length).fill(0)));
    }
    cross(v) {
        return Vector.cross(this, v);
    }
    ;
    static cross(v1, v2) {
        return new Vector([
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ]);
    }
    ;
    distance(v) {
        return Vector.distance(this, v);
    }
    ;
    static distance(v1, v2) {
        const diff = Array.from(v1).map((val, i) => val - v2[i]);
        return Math.sqrt(Vector.dot(diff, diff));
    }
    ;
    angleBetween(v) {
        return Vector.angleBetween(this, v);
    }
    ;
    static angleBetween(v1, v2) {
        const dotProduct = Vector.dot(v1, v2);
        const magnitudes = Vector.magnitude(v1) * Vector.magnitude(v2);
        if (magnitudes === 0)
            throw new Error("Cannot find angle with zero-length vector");
        return Math.acos(dotProduct / magnitudes);
    }
    ;
    radiansBetween(v) {
        return Vector.radiansBetween(this, v);
    }
    ;
    static radiansBetween(v1, v2) {
        return Vector.angleBetween(v1, v2);
    }
    degreesBetween(v) {
        return Vector.degreesBetween(this, v);
    }
    ;
    static degreesBetween(v1, v2) {
        return Vector.radiansBetween(v1, v2) * 180 / Math.PI;
    }
    project(v) {
        return Vector.project(this, v);
    }
    ;
    static project(v1, v2) {
        const scale = Vector.dot(v1, v2) / Vector.dot(v2, v2);
        return Vector.scale(v2, scale);
    }
    ;
    // utility functions
    /**
     *
     * @param args vectors to compare
     * @returns  the minimum and maximum values of the input vectors, respectively
     */
    static extrema(...args) {
        const length = args[0].length;
        return args.reduce((acc, val) => {
            return [
                acc[0].map((v, i) => Math.min(v, val[i])),
                acc[1].map((v, i) => Math.max(v, val[i]))
            ];
        }, [new Array(length).fill(Infinity), new Array(length).fill(-Infinity)])
            .map(val => new Vector(val));
    }
}
exports.Vector = Vector;
__decorate([
    (0, vectors_1.sameLength)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Vector, "add", null);
__decorate([
    (0, vectors_1.sameLength)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Vector, "multiply", null);
__decorate([
    (0, vectors_1.sameLength)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Vector, "dot", null);
__decorate([
    (0, vectors_1.sameLength)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Vector, "subtract", null);
__decorate([
    (0, vectors_1.argsHaveLength)(3),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Vector, "cross", null);
__decorate([
    (0, vectors_1.sameLength)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Vector, "distance", null);
__decorate([
    (0, vectors_1.sameLength)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Vector, "angleBetween", null);
__decorate([
    (0, vectors_1.sameLength)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Vector, "radiansBetween", null);
__decorate([
    (0, vectors_1.sameLength)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Vector, "degreesBetween", null);
__decorate([
    (0, vectors_1.sameLength)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Vector, "project", null);
__decorate([
    (0, vectors_1.sameLength)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Vector, "extrema", null);
;
//# sourceMappingURL=vector.js.map