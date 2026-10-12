import type { LinkedType } from "#linked/LinkedType";
import { LinkedTypeArg } from "#linked/LinkedTypeArg";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";

export class TypeArg extends Type {
  static Parse(walker: TokenWalker) {
    const [{ name, type }, done] = walker
      .text("name", TokenTypeName.PropertyName)
      .if(
        (s) => s.data === ":",
        (w) => w.expect(":", TokenTypeName.Punctuation).extract("type", (w) => Type.Parse(w)),
      )
      .finish();

    const result = new TypeArg(
      _context(walker, done),
      name.startsWith('"') ? JSON.parse(name) : name,
      type ?? new TypePrimitiveUnknown(_context(walker, done)),
    );

    return result;
  }

  readonly #name: string;
  readonly #type: Type;

  constructor(ctx: EntryContext, name: string, type: Type) {
    super(ctx);
    this.#name = name;
    this.#type = type;
  }

  get name() {
    return this.#name;
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext) {
    if (input && !(input instanceof LinkedTypeArg)) {
      throw new LinkerError("Bad type", input?.range ?? this.range);
    }

    return ctx.with("type", (c) => this.#type.linked(input?.type, c)).finish(({ type }) => new LinkedTypeArg(this.range, type, this.#name));
  }
}
