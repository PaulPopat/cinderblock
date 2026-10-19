import { Expression } from "./Expression.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";

export class ExpressionBrackets extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\($/gm,
      factory: (walker, lookFor, existing) => {
        const [{ subject }, done] = walker
          .expect("(", TokenTypeName.Operator)
          .extract("subject", (w) => Expression.Parse(w, [...lookFor, ")"]))
          .expect(")", TokenTypeName.Operator)
          .finish();

        return new ExpressionBrackets(_context(walker, done), subject);
      },
    });
  }

  readonly #subject: Expression;

  constructor(ctx: EntryContext, subject: Expression) {
    super(ctx);
    this.#subject = subject;
  }

  get subject() {
    return this.#subject;
  }

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return this.#subject.linked(left, ctx);
  }
}
