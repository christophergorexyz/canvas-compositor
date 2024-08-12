"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameLength = exports.argsHaveLength = void 0;
// Check if all arguments have a specific length
function argsHaveLength(length) {
    return function (_target, propertyKey, descriptor) {
        const originalFunction = descriptor.value;
        descriptor.value = function (...args) {
            if (!args.every((arg) => arg.length === length))
                throw new Error(`${propertyKey} is only defined for arguments of length ${length}`);
            return originalFunction.apply(this, args);
        };
    };
}
exports.argsHaveLength = argsHaveLength;
// Check if all arguments have the same length
function sameLength() {
    return function (_target, _propertyKey, descriptor) {
        const originalFunction = descriptor.value;
        descriptor.value = function (...args) {
            if (!args.every((arg) => arg.length === args[0].length))
                throw new Error("Vectors must have the same length");
            return originalFunction.apply(this, args);
        };
    };
}
exports.sameLength = sameLength;
//# sourceMappingURL=vectors.js.map