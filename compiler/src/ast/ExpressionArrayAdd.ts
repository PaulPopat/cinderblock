import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { TypeArray } from "./TypeArray.ts";

export class ExpressionArrayAdd extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\+\+$/gm,
      parse: (w, lookFor, e) => {
        if (!e) throw new ParserError("Unexpected ++", w.store);
        const argType = e.resolution;
        if (!(argType instanceof TypeArray))
          throw new LinkerError("May only add to arrays", w.location);

        return w
          .expect("++")
          .extract("addition", (w) => Expression.Parse(w, lookFor))
          .finish(
            ({ addition }, ctx) => new ExpressionArrayAdd(ctx, e, addition),
          );
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
}
