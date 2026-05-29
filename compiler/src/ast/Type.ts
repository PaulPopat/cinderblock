import { Entry } from "./Entry.ts";
import type { Extracted } from "./Extracted.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";

type TypeParseable = {
  priority: number;
  match: RegExp;
  chainable: boolean;
  parse: (walker: TokenWalker, previous?: Type) => Extracted<Type>;
};

export abstract class Type extends Entry {
  static #parsers: Array<TypeParseable> = [];

  static RegisterType(entry: TypeParseable) {
    this.#parsers = [...this.#parsers, entry].sort(
      (a, b) => b.priority - a.priority,
    );
  }

  static Parse(walker: TokenWalker): Extracted<Type> {
    return walker
      .reduce(
        "type",
        (s, p) =>
          !p || this.#parsers.find((p) => s.data.match(p.match))?.chainable,
        (w, _, p): Extracted<Type> => {
          const match = this.#parsers.find((p) => w.store.data.match(p.match));
          if (!match) {
            throw new ParserError(`Unexpected symbol of ${w.data}`, w.store);
          }

          return match.parse(w, p);
        },
      )
      .finish(({ type }) => type);
  }
}
