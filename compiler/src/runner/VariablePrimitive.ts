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
  abstract not_equals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;
  abstract greater_than(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;
  abstract less_than(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;
  abstract greater_than_or_equal_to(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;
  abstract less_than_or_equal_to(value: VariablePrimitive<unknown>): VariablePrimitive<boolean>;

  export() {
    return this.#value;
  }
}
