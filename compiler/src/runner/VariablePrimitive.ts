import { Variable } from "./Variable.ts";

export abstract class VariablePrimitive<T> extends Variable {
  readonly #value: T;

  constructor(value: T) {
    super();
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  abstract add(value: VariablePrimitive<unknown>): VariablePrimitive<T>;
  abstract subtract(value: VariablePrimitive<unknown>): VariablePrimitive<T>;
  abstract multiply(value: VariablePrimitive<unknown>): VariablePrimitive<T>;
  abstract divide(value: VariablePrimitive<unknown>): VariablePrimitive<T>;

  abstract and(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;
  abstract or(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;
  abstract equals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;
  abstract notEquals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;
  abstract greaterThan(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;
  abstract lessThan(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;
  abstract equalsOrGreaterThan(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;
  abstract equalsOrLessThan(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;

  export() {
    return this.#value;
  }
}
