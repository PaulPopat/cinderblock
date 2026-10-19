import type { TokenWalker } from "#tokeniser";
import { Entry } from "./Entry.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { ParserError } from "./ParserError.ts";

type EntityParseable = {
  priority: number;
  match: RegExp;
  factory: (walker: TokenWalker, namespace: string) => Entity;
};

export abstract class Entity extends Entry {
  static #parsers: Array<EntityParseable> = [];

  static RegisterEntity(entry: EntityParseable) {
    this.#parsers = [...this.#parsers, entry].sort((a, b) => b.priority - a.priority);
  }

  static HasParser(store: TokenWalker) {
    return this.#parsers.some((a) => store.data.match(a.match));
  }

  static Parse(walker: TokenWalker, namespace: string): Entity {
    const parser = this.#parsers.find((a) => walker.data.match(a.match));
    if (!parser) throw new ParserError("Unexpected token", walker);

    return parser.factory(walker, namespace);
  }

  abstract get name(): string;
  abstract search(name: string, ctx: LinkerContext): Array<Entity>;
}
