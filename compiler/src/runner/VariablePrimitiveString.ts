import { VariablePrimitive } from "./VariablePrimitive.ts";

export class VariablePrimitiveString extends VariablePrimitive<string> {
  add(value: VariablePrimitive<unknown>): VariablePrimitive<string> {
    const subject = value.value;
    if (typeof subject !== "string") throw new Error("Incompatible addition");

    return new VariablePrimitiveString(this.value + subject);
  }

  subtract(value: VariablePrimitive<unknown>): VariablePrimitive<string> {
    throw new Error("Method not implemented.");
  }

  multiply(value: VariablePrimitive<unknown>): VariablePrimitive<string> {
    throw new Error("Method not implemented.");
  }

  divide(value: VariablePrimitive<unknown>): VariablePrimitive<string> {
    throw new Error("Method not implemented.");
  }

  and(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  or(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  equals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  notEquals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
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
