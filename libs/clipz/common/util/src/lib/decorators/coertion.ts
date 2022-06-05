import { coerceBooleanProperty } from "@angular/cdk/coercion";

export function Coerce<T>(coerceFn: (value: unknown) => T): PropertyDecorator {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target: any, propertyKey: string | symbol): void => {
        const symbol: symbol = Symbol();

        Object.defineProperty(target, propertyKey, {
            get: (): T => {
                return target[symbol];
            },
            set: (value: unknown): void => {
                target[symbol] = coerceFn(value);
            },
        })
    }
}

export function CoerceBoolean(): PropertyDecorator {
    return Coerce(coerceBooleanProperty);
}