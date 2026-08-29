import type { Closure } from "#runner";
import type { TokenWalker } from "#tokeniser";
import { Entry } from "./Entry.ts";
import { ParserError } from "./ParserError.ts";

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

  static HasParser(store: TokenWalker) {
    return this.#parsers.some((a) => store.data.match(a.match));
  }

  static Parse(walker: TokenWalker, parent: () => Entry | undefined): Entity {
    const parser = this.#parsers.find((a) => walker.data.match(a.match));
    if (!parser) throw new ParserError("Unexpected token", walker);

    return new parser.factory(walker, parent);
  }

  abstract get name(): string;
  abstract build(closure: Closure): Closure;

  get fullName() {
    return [super.namespace, this.name].join("_");
  }
}
