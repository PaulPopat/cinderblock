import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Shape } from "#writer";
import type { Entry } from "./Entry.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";

export class TypeArray extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\[\]$/gm,
      chainable: true,
      factory: (walker: TokenWalker, parent: () => Entry | undefined, left?: Type) => {
        if (!left) throw new ParserError("Unexpected []", walker);
        return new TypeArray(walker.location, walker.expect("[]", TokenTypeName.Operator), parent, left);
      },
    });
  }

  readonly #contains: Type;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, left: Type) {
    super(location, done, parent);
    this.#contains = left;
  }

  get contains() {
    return this.#contains;
  }

  flattened(): Type {
    return new TypeArray(this.location, this.done, () => this.parent, this.#contains.flattened());
  }

  matches(input: Type): boolean {
    return input instanceof TypeArray && input.contains.matches(this.#contains);
  }

  representation(depth: number): string {
    return `${this.#contains.representation(depth + 1)}[]`;
  }

  shape(): Shape {
    return { type: "array", value: this.#contains.shape() };
  }
}
