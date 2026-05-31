import type { EntryContext } from "./EntryContext.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";

export class TypeArray extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\[\]$/gm,
      chainable: true,
      parse: (w, left) => {
        if (!left) throw new ParserError("Unexpected []", w.store);
        return w.expect("[]").finish((_, ctx) => new TypeArray(ctx, left));
      },
    });
  }

  readonly #contains: Type;

  constructor(ctx: EntryContext, contains: Type) {
    super(ctx);
    this.#contains = contains;
  }

  get contains() {
    return this.#contains;
  }
}
