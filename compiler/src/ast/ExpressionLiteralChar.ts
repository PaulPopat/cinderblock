import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TypePrimitiveChar } from "./TypePrimitiveChar.ts";

export class ExpressionLiteralChar extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^'([^']|\\.)'$/gm,
      parse: (w) =>
        w
          .text("value")
          .finish(
            ({ value }, ctx) =>
              new ExpressionLiteralChar(ctx, value.slice(1, value.length - 1)),
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
    return new TypePrimitiveChar(this.ctx);
  }
}
