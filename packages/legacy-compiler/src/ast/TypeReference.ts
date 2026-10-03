import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Shape } from "#writer";
import { EntityStruct } from "./EntityStruct.ts";
import type { Entry } from "./Entry.ts";
import { Type } from "./Type.ts";
import { TypeArg } from "./TypeArg.ts";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";

export class TypeReference extends Type {
  static ParseReference(walker: TokenWalker, parent: () => Entry | undefined, left?: Type) {
    const [{ value, args }, done] = walker
      .text("value", TokenTypeName.StructReference, (): TypeReference => result)
      .if(
        (s) => s.data === "(",
        (s) =>
          s
            .while(
              "args",
              (s) => (s.data === "," || s.data === "(") && s.expect([",", "("], TokenTypeName.Punctuation).data !== ")",
              (s) => TypeArg.Parse(s.expect([",", "("], TokenTypeName.Punctuation), (): Entry => result),
            )
            .expect(")", TokenTypeName.Punctuation),
      )
      .finish();

    const result = new TypeReference(walker.location, done, parent, value, args ?? []);
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
  readonly #args: Array<TypeArg>;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, name: string, args: Array<TypeArg>) {
    super(location, done, parent);
    this.#name = name;
    this.#args = args;
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
      return result.type(this.#args).flattened();
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

      return result.type(this.#args).representation(depth + 1);
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
    return this.flattened().compatible(input.flattened());
  }

  consolidate(input: Type, parent: () => Entry | undefined): TypeReference {
    return new TypeReference(this.location, this.done, parent, this.#name, this.#args);
  }
}
