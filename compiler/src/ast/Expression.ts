import type { Closure, Variable } from "#runner";
import type { Entity } from "./Entity.ts";
import { Entry } from "./Entry.ts";
import type { Extracted } from "./Extracted.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import type { Type } from "./Type.ts";

type EntityParseable = {
  priority: number;
  match: RegExp;
  parse: (walker: TokenWalker) => Extracted<Entity>;
};

type ExpressionParseable = {
  priority: number;
  match: RegExp;
  parse: (walker: TokenWalker, lookFor: Array<string>, existing?: Expression) => Extracted<Expression>;
};

export abstract class Expression extends Entry {
  static #entityParsers: Array<EntityParseable> = [];
  static #expressionParsers: Array<ExpressionParseable> = [];

  static RegisterEntity(entry: EntityParseable) {
    this.#entityParsers = [...this.#entityParsers, entry].sort((a, b) => b.priority - a.priority);
  }

  static RegisterExpression(entry: ExpressionParseable) {
    this.#expressionParsers = [...this.#expressionParsers, entry].sort((a, b) => b.priority - a.priority);
  }

  static Parse(walker: TokenWalker, lookFor: Array<string> = [";"]): Extracted<Expression> {
    return walker
      .reduce(
        "expression",
        (s) => !lookFor.includes(s.data),
        (w, _, p): Extracted<Expression> => {
          const match = this.#expressionParsers.find((p) => w.store.data.match(p.match));
          if (!match) {
            throw new ParserError(`Unexpected symbol of ${w.data}`, w.store);
          }

          return match.parse(w, lookFor, p);
        },
      )
      .finish(({ expression }) => expression);
  }

  static ParseBlock(walker: TokenWalker, lookFor: string | Array<string> = ";"): Extracted<Expression> {
    if (typeof lookFor === "string") lookFor = [lookFor];
    return walker
      .while(
        "entities",
        (s) => this.#entityParsers.find((a) => s.data.match(a.match)),
        (w, m) => m!.parse(w),
        "entity",
      )
      .reduce(
        "expression",
        (s) => !lookFor.includes(s.data),
        (w, _, p): Extracted<Expression> => {
          const match = this.#expressionParsers.find((p) => w.store.data.match(p.match));
          if (!match) {
            throw new ParserError(`Unexpected symbol of ${w.data}`, w.store);
          }

          return match.parse(w, lookFor, p);
        },
      )
      .next.finish(({ expression }) => expression);
  }

  static GetEntities(walker: TokenWalker, lookFor: string | Array<string> = ";"): Extracted<Entity[]> {
    if (typeof lookFor === "string") lookFor = [lookFor];
    return walker
      .while(
        "entities",
        (s) => this.#entityParsers.find((a) => s.data.match(a.match)),
        (w, m) => m!.parse(w),
        "entity",
      )
      .finish(({ entities }) => entities);
  }

  abstract get resolution(): Type;

  abstract resolve(closure: Closure): Variable;
}
