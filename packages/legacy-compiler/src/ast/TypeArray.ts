import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypeArray } from "#linked/LinkedTypeArray";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";

export class TypeArray extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\[\]$/gm,
      chainable: true,
      factory: (walker, namespace, left) => {
        if (!left) throw new ParserError("Unexpected []", walker);
        return new TypeArray(_context(walker, walker.expect("[]", TokenTypeName.Operator), namespace), left);
      },
    });
  }

  readonly #contains: Type;

  constructor(ctx: EntryContext, left: Type) {
    super(ctx);
    this.#contains = left;
  }

  get contains() {
    return this.#contains;
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext) {
    if (input && !(input instanceof LinkedTypeArray)) {
      throw new LinkerError("Bad type", input?.range ?? this.range);
    }

    return ctx.with("contains", (c) => this.#contains.linked(input?.contains, c)).finish(({ contains }) => new LinkedTypeArray(this.range, contains));
  }
}
