import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { Type } from "./Type.ts";
import { TokenTypeName } from "#tokeniser";
import { Entity } from "./Entity.ts";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";
import { _context, type EntryContext } from "./EntryContext.ts";

export class EntityArg extends Entity {
  static Parse(walker: TokenWalker) {
    const [{ type, name }, done] = walker
      .text("name", TokenTypeName.ParameterName)
      .if(
        (s) => s.data === ":",
        (w) => w.expect(":", TokenTypeName.Punctuation).extract("type", (w) => Type.Parse(w)),
      )
      .finish();

    return new EntityArg(
      _context(walker, done),
      name.startsWith('"') ? JSON.parse(name) : name,
      type ?? new TypePrimitiveUnknown({ location: walker.location, done }),
    );
  }

  readonly #name: string;
  readonly #type: Type;

  constructor(ctx: EntryContext, name: string, type: Type) {
    super(ctx);
    this.#name = name;
    this.#type = type;
  }

  get type() {
    return this.#type;
  }

  get name() {
    return this.#name;
  }
}
