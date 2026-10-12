import { Entry } from "./Entry.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import type { LinkedType } from "#linked/LinkedType";

type TypeParseable = {
  priority: number;
  match: RegExp;
  chainable: boolean;
  factory: (walker: TokenWalker, left?: Type) => Type;
};

export abstract class Type extends Entry {
  static #parsers: Array<TypeParseable> = [];

  static RegisterType(entry: TypeParseable) {
    this.#parsers = [...this.#parsers, entry].sort((a, b) => b.priority - a.priority);
  }

  static Parse(walker: TokenWalker): Type {
    const [{ type }] = walker
      .reduce(
        "type",
        (s, p) => !p || this.#parsers.find((p) => s.data.match(p.match))?.chainable,
        (w, _, p): Type => {
          const match = this.#parsers.find((p) => w.data.match(p.match));
          if (!match) {
            throw new ParserError(`Unexpected symbol of ${w.data}`, w);
          }

          return match.factory(w, p as Type);
        },
      )
      .finish();

    return type as Type;
  }

  abstract linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType];
}
