import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { Type } from "./Type.ts";
import { TokenTypeName } from "#tokeniser";
import { Entity } from "./Entity.ts";
import { TypePrimitiveUnknown } from "./TypePrimitiveUnknown.ts";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedEntry } from "#linked/LinkedEntry";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedTypeArg } from "#linked/LinkedTypeArg";
import { LinkerError } from "./LinkerError.ts";

export class EntityArg extends Entity {
  static Parse(walker: TokenWalker, namespace: string) {
    const [{ type, name }, done] = walker
      .text("name", TokenTypeName.ParameterName)
      .if(
        (s) => s.data === ":",
        (w) => w.expect(":", TokenTypeName.Punctuation).extract("type", (w) => Type.Parse(w, namespace)),
      )
      .finish();

    return new EntityArg(
      _context(walker, done, namespace),
      name.startsWith('"') ? JSON.parse(name) : name,
      type ?? new TypePrimitiveUnknown(_context(walker, done, namespace)),
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

  linked(left: LinkedEntry | undefined, ctx: LinkerContext): [LinkerContext, LinkedTypeArg] {
    if (left && !(left instanceof LinkedTypeArg)) {
      throw new LinkerError("Invalid type", left.range);
    }

    return ctx
      .with("type", (c) => this.#type.linked(left?.type, c))
      .finishSearchable(this.#name, ({ type }) => new LinkedTypeArg(this.range, type, this.#name));
  }

  load(ctx: LinkerContext): LinkerContext {
    return ctx;
  }

  search(name: string): Array<Entity> {
    return [];
  }
}
