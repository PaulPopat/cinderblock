import { VariablePrimitiveBool, type Closure, type Variable } from "#runner";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";

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
    return new TypePrimitiveBool(this.ctx);
  }

  async resolve(closure: Closure): Promise<Variable> {
    return new VariablePrimitiveBool(this.#value);
  }
}
