import { VariablePrimitive } from "./VariablePrimitive.ts";
import { VariablePrimitiveBool } from "./VariablePrimitiveBool.ts";

export class VariablePrimitiveInt extends VariablePrimitive<number> {
  add(value: VariablePrimitive<unknown>): VariablePrimitive<number> {
    const subject = value.value;
    if (typeof subject !== "number") throw new Error("Incompatible addition");

    return new VariablePrimitiveInt(Math.floor(this.value + subject));
  }

  subtract(value: VariablePrimitive<unknown>): VariablePrimitive<number> {
    const subject = value.value;
    if (typeof subject !== "number") throw new Error("Incompatible addition");

    return new VariablePrimitiveInt(Math.floor(this.value - subject));
  }

  multiply(value: VariablePrimitive<unknown>): VariablePrimitive<number> {
    const subject = value.value;
    if (typeof subject !== "number") throw new Error("Incompatible addition");

    return new VariablePrimitiveInt(Math.floor(this.value * subject));
  }

  divide(value: VariablePrimitive<unknown>): VariablePrimitive<number> {
    const subject = value.value;
    if (typeof subject !== "number") throw new Error("Incompatible addition");

    return new VariablePrimitiveInt(Math.floor(this.value / subject));
  }

  and(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  or(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  equals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    const subject = value.value;
    if (typeof subject !== "number") throw new Error("Incompatible addition");

    return new VariablePrimitiveBool(this.value === subject);
  }

  not_equals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    const subject = value.value;
    if (typeof subject !== "number") throw new Error("Incompatible addition");

    return new VariablePrimitiveBool(this.value !== subject);
  }

  greater_than(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    const subject = value.value;
    if (typeof subject !== "number") throw new Error("Incompatible addition");

    return new VariablePrimitiveBool(this.value > subject);
  }

  less_than(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    const subject = value.value;
    if (typeof subject !== "number") throw new Error("Incompatible addition");

    return new VariablePrimitiveBool(this.value < subject);
  }

  greater_than_or_equal_to(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    const subject = value.value;
    if (typeof subject !== "number") throw new Error("Incompatible addition");

    return new VariablePrimitiveBool(this.value >= subject);
  }

  less_than_or_equal_to(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    const subject = value.value;
    if (typeof subject !== "number") throw new Error("Incompatible addition");

    return new VariablePrimitiveBool(this.value <= subject);
  }
}
