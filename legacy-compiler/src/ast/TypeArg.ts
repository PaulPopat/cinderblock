import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Shape } from "#writer";
import type { Entry } from "./Entry.ts";
import { Type } from "./Type.ts";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";

export class TypeArg extends Type {
  static Parse(walker: TokenWalker, parent: () => Entry | undefined) {
    const [{ name, type }, done] = walker
      .text("name", TokenTypeName.PropertyName)
      .if(
        (s) => s.data === ":",
        (w) => w.expect(":", TokenTypeName.Punctuation).extract("type", (w) => Type.Parse(w, (): Entry => result)),
      )
      .finish();

    const result = new TypeArg(
      walker.location,
      done,
      parent,
      type ?? new TypePrimitiveUnknown(walker.location, done, (): Entry => result),
      name.startsWith('"') ? JSON.parse(name) : name,
    );

    return result;
  }

  readonly #type: Type;
  readonly #name: string;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, type: Type, name: string) {
    super(location, done, parent);
    this.#type = type;
    this.#name = name.startsWith('"') ? JSON.parse(name) : name;
  }

  get type() {
    return this.#type;
  }

  get name() {
    return this.#name;
  }

  flattened(): TypeArg {
    return new TypeArg(this.location, this.done, () => this.parent, this.#type.flattened(), this.#name);
  }

  matches(input: Type): boolean {
    return input instanceof TypeArg && input.name === this.#name && input.type.matches(this.#type);
  }

  representation(depth: number): string {
    return `${this.#name}: ${this.#type.representation(depth + 1)}`;
  }

  shape(): Shape {
    return { type: "null" };
  }

  dig(name: string) {
    if (name === this.#name) return this.type.flattened();
    return undefined;
  }
}
