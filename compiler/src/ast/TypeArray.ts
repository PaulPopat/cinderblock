import type { TokenStore } from "#tokeniser";
import type { Location } from "#utils";
import type { Entry } from "./Entry.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { Type } from "./Type.ts";

export class TypeArray extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\[\]$/gm,
      chainable: true,
      factory: (walker: TokenWalker, parent: Entry | undefined, left?: Type) => {
        if (!left) throw new ParserError("Unexpected []", walker.store);
        return new TypeArray(walker.location, walker.expect("[]").store, parent, left);
      },
    });
  }

  readonly #contains: Type;

  constructor(location: Location, done: TokenStore, parent: Entry | undefined, left: Type) {
    super(location, done, parent);
    this.#contains = left;
  }

  get contains() {
    return this.#contains;
  }
}
