import { Entry } from "./Entry.ts";
import { ParserError } from "./ParserError.ts";
import { TokenWalker } from "#tokeniser";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";

type ExpressionParseable = {
  priority: number;
  match: RegExp;
  inOne?: boolean;
  factory: (walker: TokenWalker, lookFor: Array<string>, existing: Expression | undefined) => Expression;
};

export abstract class Expression extends Entry {
  static #parsers: Array<ExpressionParseable> = [];

  static RegisterExpression(entry: ExpressionParseable) {
    this.#parsers = [...this.#parsers, entry].sort((a, b) => b.priority - a.priority);
  }

  static ParseOne(walker: TokenWalker): Expression {
    const match = this.#parsers.find((p) => walker.data.match(p.match));
    if (!match) {
      throw new ParserError(`Unexpected symbol of ${walker.data}`, walker);
    }

    const left = match.factory(walker, [";"], undefined);

    const [{ right }] = left.done
      .reduce(
        "right",
        (s) => s.data !== ";" && !!this.#parsers.find((p) => s.data.match(p.match))?.inOne,
        (w, _, p): Expression => {
          const match = this.#parsers.find((p) => w.data.match(p.match));
          if (!match) {
            throw new ParserError(`Unexpected symbol of ${w.data}`, w);
          }

          return match.factory(w, [";"], p);
        },
        left,
      )
      .finish();

    return right;
  }

  static Parse(walker: TokenWalker, lookFor: Array<string> = [";"]): Expression {
    const [{ expression }] = walker
      .reduce(
        "expression",
        (s) => !lookFor.includes(s.data),
        (w, _, p): Expression => {
          const match = this.#parsers.find((p) => w.data.match(p.match));
          if (!match) {
            throw new ParserError(`Unexpected symbol of ${w.data}`, w);
          }

          return match.factory(w, lookFor, p);
        },
      )
      .finish();

    return expression;
  }

  abstract linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression];
}
