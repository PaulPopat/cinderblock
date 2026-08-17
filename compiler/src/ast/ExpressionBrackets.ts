import { type Closure, type Variable } from "#runner";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";

export class ExpressionBrackets extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\($/gm,
      parse: (w, lookFor) => {
        return w
          .expect("(")
          .extract("subject", (w) => Expression.Parse(w, [...lookFor, ")"]))
          .expect(")")
          .finish(({ subject }, ctx) => new ExpressionBrackets(ctx, subject));
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

  get resolution() {
    return this.#subject.resolution;
  }

  resolve(closure: Closure): Promise<Variable> {
    return this.#subject.resolve(closure);
  }
}
