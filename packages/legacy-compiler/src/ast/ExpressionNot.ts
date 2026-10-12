import { Expression } from "./Expression.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";

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
}
