import type { TokenStore } from "#tokeniser";
import type { Location } from "#utils";
import type { Entity } from "./Entity.ts";
import { Entry } from "./Entry.ts";
import type { EntryContext } from "./EntryContext.ts";
import type { Extracted } from "./Extracted.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";

type TypeParseable = {
  priority: number;
  applicable: (store: TokenStore) => boolean;
  parse: (walker: TokenWalker) => Extracted<Type>;
};

export abstract class Type extends Entry {
  static #parsers: Array<TypeParseable> = [];

  static RegisterType(entry: TypeParseable) {
    this.#parsers = [...this.#parsers, entry].sort(
      (a, b) => b.priority - a.priority,
    );
  }

  static Parse(walker: TokenWalker): Extracted<Type> {
    const match = this.#parsers.find((p) => p.applicable(walker.store));
    if (!match) {
      throw new ParserError(`Unexpected symbol of ${match}`, walker.store);
    }

    return match.parse(walker);
  }

  readonly #entities: Array<Entity>;

  constructor(ctx: EntryContext, entities: Array<Entity>) {
    super(ctx);
    this.#entities = entities;
  }

  get entities() {
    return this.#entities;
  }
}
