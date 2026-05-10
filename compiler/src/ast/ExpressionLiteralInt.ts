import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";

export class ExpressionLiteralInt extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /i?[0-9]+$/gm,
      parse: (w) =>
        w
          .text("value")
          .finish(
            ({ value }, ctx) =>
              new ExpressionLiteralInt(ctx, value.replace("i", "")),
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
}
