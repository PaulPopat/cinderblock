import { TypeArg } from "./TypeArg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TypeTuple } from "./TypeTuple.ts";

export class ExpressionTuple extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^,$/gm,
      parse: (w, lookFor, left) => {
        if (!left) throw new ParserError("Unexpected ,", w.store);
        return w
          .expect("->")
          .extract("right", (w) => Expression.Parse(w, lookFor))
          .finish(
            ({ right }, ctx) =>
              new ExpressionTuple(ctx, [
                ...(left instanceof ExpressionTuple ? left.parts : [left]),
                right,
              ]),
          );
      },
    });
  }

  readonly #parts: Array<Expression>;

  constructor(ctx: EntryContext, parts: Array<Expression>) {
    super(ctx);
    this.#parts = parts;
  }

  get parts() {
    return this.#parts;
  }

  get resolution() {
    return new TypeTuple(
      this.ctx,
      this.#parts.map((p, i) => new TypeArg(this.ctx, p.resolution, "_" + i)),
    );
  }
}
