import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TypePrimitiveLong } from "./TypePrimitiveLong.ts";

export class ExpressionLiteralLong extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /l?[0-9]+$/gm,
      parse: (w) =>
        w
          .text("value")
          .finish(
            ({ value }, ctx) =>
              new ExpressionLiteralLong(ctx, value.replace("l", "")),
          ),
    });
  }

  readonly #value: string;

  constructor(ctx: EntryContext, value: string) {
    super(ctx);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypePrimitiveLong(this.ctx);
  }
}
