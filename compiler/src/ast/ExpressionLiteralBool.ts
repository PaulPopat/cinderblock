import { Binary, Instructions, Serialise } from "#binary";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TypePrimitiveChar } from "./TypePrimitiveChar.ts";

export class ExpressionLiteralBool extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^(true|false)$/gm,
      parse: (w) => w.text("value").finish(({ value }, ctx) => new ExpressionLiteralBool(ctx, value === "true")),
    });
  }

  readonly #value: boolean;

  constructor(ctx: EntryContext, value: boolean) {
    super(ctx);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypePrimitiveChar(this.ctx);
  }

  instructions(binary: Binary) {
    return binary.with(Instructions.Bool(Serialise.Bool(this.#value)));
  }
}
