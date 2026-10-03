import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";

export abstract class TypePrimitive extends Type {
  abstract get name(): string;

  flattened(): Type {
    return this;
  }

  matches(input: Type): boolean {
    return input instanceof this.constructor;
  }

  representation(): string {
    return this.name;
  }

  compatible(input: Type): boolean {
    return input instanceof TypePrimitive;
  }

  consolidate(input: Type): Type {
    if (!(input instanceof TypePrimitive)) {
      throw new LinkerError("Invalid type", input.range);
    }

    return input;
  }
}
