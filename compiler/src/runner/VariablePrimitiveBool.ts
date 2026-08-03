import { VariablePrimitive } from "./VariablePrimitive.ts";

export class VariablePrimitiveBool extends VariablePrimitive<boolean> {
  add(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  subtract(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  multiply(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  divide(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  and(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    if (!(value instanceof VariablePrimitiveBool)) throw new Error("Must be a boolean");
    return new VariablePrimitiveBool(this.value && value.value);
  }

  or(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    if (!(value instanceof VariablePrimitiveBool)) throw new Error("Must be a boolean");
    return new VariablePrimitiveBool(this.value || value.value);
  }

  equals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    if (!(value instanceof VariablePrimitiveBool)) throw new Error("Must be a boolean");
    return new VariablePrimitiveBool(this.value === value.value);
  }

  notEquals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    if (!(value instanceof VariablePrimitiveBool)) throw new Error("Must be a boolean");
    return new VariablePrimitiveBool(this.value !== value.value);
  }

  greaterThan(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  lessThan(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  equalsOrGreaterThan(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  equalsOrLessThan(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }
}
