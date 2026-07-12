import { Binary, Instructions } from "#binary";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";

export class ExpressionArrayAdd extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\+\+$/gm,
      parse: (w, lookFor, e) => {
        if (!e) throw new ParserError("Unexpected ++", w.store);

        return w
          .expect("++")
          .extract("addition", (w) => Expression.Parse(w, lookFor))
          .finish(({ addition }, ctx) => new ExpressionArrayAdd(ctx, e, addition));
      },
    });
  }

  readonly #subject: Expression;
  readonly #addition: Expression;

  constructor(ctx: EntryContext, subject: Expression, addition: Expression) {
    super(ctx);
    this.#subject = subject;
    this.#addition = addition;
  }

  get subject() {
    return this.#subject;
  }

  get addition() {
    return this.#addition;
  }

  get resolution() {
    return this.#subject.resolution;
  }

  instructions(binary: Binary) {
    return binary
      .including((b) => this.#subject.instructions(b))
      .including((b) => this.#addition.instructions(b))
      .with(Instructions["++"]());
  }
}
