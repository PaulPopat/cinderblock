import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Shape } from "#writer";
import { EntityStruct } from "./EntityStruct.ts";
import type { Entry } from "./Entry.ts";
import { Type } from "./Type.ts";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";

export class TypeReference extends Type {
  static ParseReference(walker: TokenWalker, parent: () => Entry | undefined, left?: Type) {
    const [{ value }, done] = walker.text("value", TokenTypeName.StructReference, (): TypeReference => result).finish();

    const result = new TypeReference(walker.location, done, parent, value);
    return result;
  }

  static {
    Type.RegisterType({
      priority: 1,
      match: /^[a-zA-Z][a-zA-Z0-9_@$#:]*$/gm,
      chainable: false,
      factory: TypeReference.ParseReference,
    });
  }

  readonly #name: string;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, name: string) {
    super(location, done, parent);
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  get subject() {
    return this.float(this.#name);
  }

  flattened(): Type {
    const result = this.float(this.#name);
    if (result instanceof EntityStruct) {
      return result.type.flattened();
    }

    if (result instanceof Type) {
      return result.flattened();
    }

    return new TypePrimitiveUnknown(this.location, this.done, () => this);
  }

  matches(input: Type): boolean {
    throw new Error("Not implemented");
  }

  representation(depth: number): string {
    const result = this.float(this.#name);
    if (result instanceof EntityStruct) {
      if (depth > 1) {
        return result.name;
      }

      return result.type.representation(depth + 1);
    }

    if (result instanceof Type) {
      return result.representation(depth + 1);
    }

    return this.#name;
  }

  shape(): Shape {
    return this.flattened().shape();
  }

  compatible(input: Type): boolean {
    return input.flattened().compatible(input);
  }
}
