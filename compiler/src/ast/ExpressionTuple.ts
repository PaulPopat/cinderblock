import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";

export class ExpressionTuple extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^,$/gm,
      parse: (w, left) => {
        if (!left) throw new ParserError("Unexpected ,", w.store);
        return w
          .expect("->")
          .extract("right", Expression.Parse)
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
}
