import { Expression } from "./Expression.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionNot } from "#linked/LinkedExpressionNot";

export class ExpressionNot extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\!$/gm,
      inOne: false,
      factory: (walker, lookFor, existing) => {
        const [{ subject }, done] = walker
          .expect("!", TokenTypeName.Operator)
          .extract("subject", (w) => Expression.ParseOne(w))
          .finish();

        return new ExpressionNot(_context(walker, done), subject);
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
    return ctx.with("subject", (c) => this.#subject.linked(left, c)).finish(({ subject }) => new LinkedExpressionNot(this.range, subject));
  }
}
