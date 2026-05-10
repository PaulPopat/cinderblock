import type { TokenStore } from "#tokeniser";
import type { Location } from "#utils";
import type { Entity } from "./Entity.ts";
import { Entry } from "./Entry.ts";
import type { EntryContext } from "./EntryContext.ts";
import type { Extracted } from "./Extracted.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";

type EntityParseable = {
  priority: number;
  applicable: (store: TokenStore) => boolean;
  parse: (walker: TokenWalker) => Extracted<Entity>;
};

type ExpressionParseable = {
  priority: number;
  applicable: (store: TokenStore, existing?: Expression) => boolean;
  parse: (walker: TokenWalker, existing?: Expression) => Extracted<Expression>;
};

export abstract class Expression extends Entry {
  static #entityParsers: Array<EntityParseable> = [];
  static #expressionParsers: Array<ExpressionParseable> = [];

  static RegisterEntity(entry: EntityParseable) {
    this.#entityParsers = [...this.#entityParsers, entry].sort(
      (a, b) => b.priority - a.priority,
    );
  }

  static RegisterExpression(entry: ExpressionParseable) {
    this.#expressionParsers = [...this.#expressionParsers, entry].sort(
      (a, b) => b.priority - a.priority,
    );
  }

  static Parse(walker: TokenWalker): Extracted<Expression> {
    return walker
      .while(
        "entities",
        (s) => this.#entityParsers.find((a) => a.applicable(s)),
        (w, m) => m!.parse(w),
        "entity",
      )
      .reduce(
        "expression",
        (s) => s.data !== ";",
        (w, _, p): Extracted<Expression> => {
          const match = this.#expressionParsers.find((p) =>
            p.applicable(w.store),
          );
          if (!match) {
            throw new ParserError(`Unexpected symbol of ${w.data}`, w.store);
          }

          return match.parse(w, p);
        },
      )
      .finish(({ expression }) => expression);
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
