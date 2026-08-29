import { VariablePrimitive } from "./VariablePrimitive.ts";
import { VariablePrimitiveBool } from "./VariablePrimitiveBool.ts";

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
    const subject = value.value;
    if (typeof subject !== "string") throw new Error("Incompatible check");

    return new VariablePrimitiveBool(this.value == subject);
  }

  not_equals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    const subject = value.value;
    if (typeof subject !== "string") throw new Error("Incompatible check");

    return new VariablePrimitiveBool(this.value != subject);
  }

  greater_than(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  less_than(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  greater_than_or_equal_to(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  less_than_or_equal_to(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }
}
