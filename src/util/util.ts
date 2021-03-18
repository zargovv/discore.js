export function isPrefix(prefix: any) {
  return typeof prefix === 'string' || prefix instanceof RegExp;
}

export function isObject(obj: any) {
  return (
    obj !== null && typeof obj === 'object' && obj.constructor.name === 'Object'
  );
}

export function range(max: number): Iterable<number>;
export function range(min: number, max: number): Iterable<number>;
export function range(min: number, max: number, inc: number): Iterable<number>;
export function* range(
  min: number,
  max?: number,
  inc: number = 1
): Iterable<number> {
  if (typeof max !== 'number') [min, max] = [0, min];
  for (let i = min; max > min ? i < max : i > min; i += inc) yield i;
}

export function deepMerge<
  T extends { [K: string]: any },
  S extends { [K: string]: any }
>(target: T, source: S): T & S {
  const newObj: Partial<T & S> = {};
  const keySet = new Set([...Object.keys(target), ...Object.keys(source)]);
  for (const key of Array.from(keySet)) {
    const targetValue = target[key];
    const sourceValue = source[key];
    if (isObject(targetValue)) {
      newObj[key as keyof T & S] = isObject(sourceValue)
        ? deepMerge(targetValue, sourceValue)
        : targetValue;
    } else {
      newObj[key as keyof T & S] = sourceValue || targetValue;
    }
  }
  return newObj as T & S;
}
