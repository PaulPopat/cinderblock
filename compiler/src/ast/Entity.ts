import type { TokenStore } from "#tokeniser";
import { Entry } from "./Entry.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";

type EntityParseable = {
  priority: number;
  match: RegExp;
  factory: new (walker: TokenWalker, parent: () => Entry | undefined) => Entity;
};

export abstract class Entity extends Entry {
  static #parsers: Array<EntityParseable> = [];

  static RegisterEntity(entry: EntityParseable) {
    this.#parsers = [...this.#parsers, entry].sort((a, b) => b.priority - a.priority);
  }

  static HasParser(store: TokenStore) {
    return this.#parsers.some((a) => store.data.match(a.match));
  }

  static Parse(walker: TokenWalker, parent: () => Entry | undefined): Entity {
    const parser = this.#parsers.find((a) => walker.data.match(a.match));
    if (!parser) throw new ParserError("Unexpected token", walker.store);

    return new parser.factory(walker, parent);
  }

  abstract get fullName(): string;
}
