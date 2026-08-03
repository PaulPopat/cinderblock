import { VariablePrimitive } from "./VariablePrimitive.ts";
import { VariablePrimitiveBool } from "./VariablePrimitiveBool.ts";

export class VariablePrimitiveNull extends VariablePrimitive<null> {
  add(value: VariablePrimitive<unknown>): VariablePrimitive<never> {
    throw new Error("Method not implemented.");
  }

  subtract(value: VariablePrimitive<unknown>): VariablePrimitive<never> {
    throw new Error("Method not implemented.");
  }

  multiply(value: VariablePrimitive<unknown>): VariablePrimitive<never> {
    throw new Error("Method not implemented.");
  }

  divide(value: VariablePrimitive<unknown>): VariablePrimitive<never> {
    throw new Error("Method not implemented.");
  }

  and(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  or(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    throw new Error("Method not implemented.");
  }

  equals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    return new VariablePrimitiveBool(value instanceof VariablePrimitiveNull);
  }

  notEquals(value: VariablePrimitive<unknown>): VariablePrimitive<boolean> {
    return new VariablePrimitiveBool(!(value instanceof VariablePrimitiveNull));
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
