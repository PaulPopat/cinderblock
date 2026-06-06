import { EntityArg } from "./EntityArg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";
import { TypeUnion } from "./TypeUnion.ts";

export class ExpressionIs extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^%$/gm,
      parse: (w, lookFor, e) => {
        if (!e) throw new ParserError("Unexpected %", w.store);
        return w
          .expect("%")
          .extract("expected", Type.Parse)
          .extract("as", (w, { expected }) =>
            w
              .text("name")
              .finish(({ name }, ctx) => new EntityArg(ctx, expected, name)),
          )
          .expect("?")
          .extract("positive", (w, { as }) =>
            Expression.Parse(w.withEntity(as), ":"),
          )
          .expect(":")
          .extract("negative", (w) => Expression.Parse(w, lookFor))
          .finish(
            ({ expected, as, positive, negative }, ctx) =>
              new ExpressionIs(ctx, e, expected, as, positive, negative),
          );
      },
    });
  }

  readonly #subject: Expression;
  readonly #expected: Type;
  readonly #as: EntityArg;
  readonly #positive: Expression;
  readonly #negative: Expression;

  constructor(
    ctx: EntryContext,
    subject: Expression,
    expected: Type,
    as: EntityArg,
    positive: Expression,
    negative: Expression,
  ) {
    super(ctx);
    this.#subject = subject;
    this.#expected = expected;
    this.#as = as;
    this.#positive = positive;
    this.#negative = negative;
  }

  get subject() {
    return this.#subject;
  }

  get expected() {
    return this.#expected;
  }

  get as() {
    return this.#as;
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
