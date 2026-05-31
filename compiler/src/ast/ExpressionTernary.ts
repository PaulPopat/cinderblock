import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TypeUnion } from "./TypeUnion.ts";

export class ExpressionTernary extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^\?$/gm,
      parse: (w, predicate) => {
        if (!predicate) throw new ParserError("Unexpected ?", w.store);
        return w
          .expect("?")
          .extract("positive", Expression.Parse)
          .expect(":")
          .extract("negative", Expression.Parse)
          .finish(
            ({ positive, negative }, ctx) =>
              new ExpressionTernary(ctx, predicate, positive, negative),
          );
      },
    });
  }

  readonly #predicate: Expression;
  readonly #positive: Expression;
  readonly #negative: Expression;

  constructor(
    ctx: EntryContext,
    predicate: Expression,
    positive: Expression,
    negative: Expression,
  ) {
    super(ctx);
    this.#predicate = predicate;
    this.#positive = positive;
    this.#negative = negative;
  }

  get predicate() {
    return this.#predicate;
  }

  get positive() {
    return this.#positive;
  }

  get negative() {
    return this.#negative;
  }

  get resolution() {
    return new TypeUnion(this.ctx, [
      this.#positive.resolution,
      this.#negative.resolution,
    ]);
  }
}
