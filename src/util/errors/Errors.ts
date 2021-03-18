const codeSymbol = Symbol('code');

function DiscoreError(Base: any) {
  return class DiscoreError extends Base {
    [codeSymbol]: string;

    constructor(message: string) {
      super(message);

      this[codeSymbol] = message;
      if (Error.captureStackTrace) Error.captureStackTrace(this, DiscoreError);
    }

    get name() {
      return `${super.name} ${this[codeSymbol]}`;
    }

    get code() {
      return this[codeSymbol];
    }
  };
}

const _Error = DiscoreError(Error);
const _TypeError = DiscoreError(TypeError);
const _RangeError = DiscoreError(RangeError);

export { _Error as Error, _TypeError as TypeError, _RangeError as RangeError };
