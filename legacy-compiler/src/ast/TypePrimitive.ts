import { Type } from "./Type.ts";

export abstract class TypePrimitive extends Type {
  abstract get name(): string;

  flattened(generics: Record<string, Type>): Type {
    return this;
  }

  matches(input: Type): boolean {
    return input instanceof this.constructor;
  }

  representation(): string {
    return this.name;
  }
}
