

interface IOptions {
    resultProp?: string,
    listIndex?: number,
}

export function toCachingFunction<T, A>(
    method: (a?: A) => Promise<T>,
    options?: IOptions
): (a?: A) => Promise<T>;

export function toCachingFunction<T, A, B>(
    method: (a?: A, b?: B) => Promise<T>,
    options?: IOptions
): (a?: A, b?: B) => Promise<T>;

export function toCachingFunction<T, A, B, C>(
    method: (a?: A, b?: B, c?: C) => Promise<T>,
    options?: IOptions
): (a?: A, b?: B, c?: C) => Promise<T>;

export function toCachingFunction<T, A, B, C, D>(
    method: (a?: A, b?: B, c?: C, d?: D) => Promise<T>,
    options?: IOptions
): (a?: A, b?: B, c?: C, d?: D) => Promise<T>

export function toCachingFunction<T, A, B, C, D, E>(
    method: (a?: A, b?: B, c?: C, d?: D, e?: E) => Promise<T>,
    options?: IOptions
): (a?: A, b?: B, c?: C, d?: D, e?: E) => Promise<T>

export function toCachingFunction<T, A, B, C, D, E, F>(
    method: (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F) => Promise<T>,
    options?: IOptions
): (a?: A, b?: B, c?: C, d?: D, e?: E, f?: F) => Promise<T>

export function toCachingFunction<T, TO_MANY>(
    method: (...TO_MANY) => Promise<T>,
    options?: IOptions
): (...TO_MANY) => Promise<T>