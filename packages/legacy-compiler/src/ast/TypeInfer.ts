import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Shape } from "#writer";
import { EntityStruct } from "./EntityStruct.ts";
import type { Entry } from "./Entry.ts";
import { Type } from "./Type.ts";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";

export class TypeInfer extends Type {
  static ParseInfer(walker: TokenWalker, parent: () => Entry | undefined, left?: Type) {
    const [{ value }, done] = walker
      .expect("infer", TokenTypeName.KeyWord, (): TypeInfer => result)
      .text("value", TokenTypeName.StructReference, (): TypeInfer => result)
      .finish();

    const result = new TypeInfer(walker.location, done, parent, value, new TypePrimitiveUnknown(walker.location, done, parent));
    return result;
  }

  static {
    Type.RegisterType({
      priority: 2,
      match: /^infer$/gm,
      chainable: false,
      factory: TypeInfer.ParseInfer,
    });
  }

  readonly #name: string;
  readonly #instance: Type;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, name: string, instance: Type) {
    super(location, done, parent);
    this.#name = name;
    this.#instance = instance;
  }

  get name() {
    return this.#name;
  }

  get subject() {
    return this.float(this.#name);
  }

  flattened(): Type {
    return this.#instance;
  }

  matches(input: Type): boolean {
    throw new Error("Not implemented");
  }

  representation(depth: number): string {
    return `infer ${this.#name}`;
  }

  shape(): Shape {
    return this.flattened().shape();
  }

  compatible(input: Type): boolean {
    return this.flattened().compatible(input.flattened());
  }

  dig(name: string): Entry | undefined {
    if (name === this.#name) return this.#instance;
    return undefined;
  }

  consolidate(input: Type, parent: () => Entry | undefined): TypeInfer {
    return new TypeInfer(this.location, this.done, parent, this.#name, input);
  }
}
