import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Shape } from "#writer";
import { EntityStruct } from "./EntityStruct.ts";
import type { Entry } from "./Entry.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypeArg } from "./TypeArg.ts";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";

export class TypeReference extends Type {
  static ParseReference(walker: TokenWalker, parent: () => Entry | undefined, left?: Type) {
    const [{ value, args }, done] = walker
      .text("value", TokenTypeName.StructReference, (): TypeReference => result)
      .if(
        (s) => s.data === "<",
        (s) =>
          s
            .expect("<", TokenTypeName.Punctuation)
            .while(
              "args",
              (s) => s.data !== ">",
              (s): TypeArg => TypeArg.Parse(s, () => result),
            )
            .expect(">", TokenTypeName.Punctuation),
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
  readonly #generics: Array<TypeArg>;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, name: string, generics: Array<TypeArg>) {
    super(location, done, parent);
    this.#name = name;
    this.#generics = generics;
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
      const final = new EntityStruct(result, this.#generics);
      return final.type.flattened();
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
    return this.flattened().representation(depth + 1);
  }

  shape(): Shape {
    return this.flattened().shape();
  }
}
