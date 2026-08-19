import type { Closure, Variable } from "#runner";
import type { Entity } from "./Entity.ts";
import { Entry } from "./Entry.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import type { Type } from "./Type.ts";

type ExpressionParseable = {
  priority: number;
  match: RegExp;
  factory: new (walker: TokenWalker, parent: Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) => Expression;
};

export abstract class Expression extends Entry {
  static #parsers: Array<ExpressionParseable> = [];

  static RegisterExpression(entry: ExpressionParseable) {
    this.#parsers = [...this.#parsers, entry].sort((a, b) => b.priority - a.priority);
  }

  static Parse(walker: TokenWalker, parent: Entry | undefined, lookFor: Array<string> = [";"]): Expression {
    const [{ expression }] = walker
      .reduce(
        "expression",
        (s) => !lookFor.includes(s.data),
        (w, _, p): Expression => {
          const match = this.#parsers.find((p) => w.store.data.match(p.match));
          if (!match) {
            throw new ParserError(`Unexpected symbol of ${w.data}`, w.store);
          }

          return new match.factory(w, parent, lookFor, p);
        },
      )
      .finish();

    return expression;
  }

  abstract get resolution(): Type;

  abstract resolve(closure: Closure): Promise<Variable>;
}
