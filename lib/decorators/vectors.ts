// Check if all arguments have a specific length
export function argsHaveLength(length: number) {
  return function (_target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (!args.every((arg) => arg.length === length)) throw new Error(`${propertyKey} is only defined for arguments of length ${length}`);
      return originalFunction.apply(this, args);
    };
  };
}

// Check if all arguments have the same length
export function sameLength() {
  return function (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalFunction = descriptor.value;
    descriptor.value = function (...args: Array<unknown>[]) {
      if (!args.every((arg) => arg.length === args[0].length)) throw new Error("Vectors must have the same length");
      return originalFunction.apply(this, args);
    };
  };
}

