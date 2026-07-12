import { Binary, Instructions, Serialise } from "#binary";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TypePrimitiveDouble } from "./TypePrimitiveDouble.ts";

export class ExpressionLiteralDouble extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^[0-9]+\.[0-9]+d$/gm,
      parse: (w) => w.text("value").finish(({ value }, ctx) => new ExpressionLiteralDouble(ctx, value.replace("d", ""))),
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
    return new TypePrimitiveDouble(this.ctx);
  }

  instructions(binary: Binary) {
    return binary.with(Instructions.Double(Serialise.Double(this.#value)));
  }
}
