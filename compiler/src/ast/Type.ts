import { Entry } from "./Entry.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";

type TypeParseable = {
  priority: number;
  match: RegExp;
  chainable: boolean;
  factory: (walker: TokenWalker, parent: () => Entry | undefined, left?: Type) => Type;
};

export abstract class Type extends Entry {
  static #parsers: Array<TypeParseable> = [];

  static RegisterType(entry: TypeParseable) {
    this.#parsers = [...this.#parsers, entry].sort((a, b) => b.priority - a.priority);
  }

  static Parse(walker: TokenWalker, parent: () => Entry | undefined): Type {
    const [{ type }] = walker
      .reduce(
        "type",
        (s, p) => !p || this.#parsers.find((p) => s.data.match(p.match))?.chainable,
        (w, _, p): Type => {
          const match = this.#parsers.find((p) => w.data.match(p.match));
          if (!match) {
            throw new ParserError(`Unexpected symbol of ${w.data}`, w);
          }

          return match.factory(w, parent, p);
        },
      )
      .finish();

    return type;
  }

  float(name: string): Entry | undefined {
    return this.parent?.float(name);
  }

  dig(name: string): Entry | undefined {
    return undefined;
  }
}
