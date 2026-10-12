import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TypePrimitiveFloat } from "./TypePrimitiveFloat.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import type { Type } from "./Type.ts";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionLiteralFloat extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /[0-9]+\.[0-9]+f?$/gm,
      factory: (walker, lookFor, existing) => {
        const [{ value }, done] = walker.text("value", TokenTypeName.Number).finish();
        return new ExpressionLiteralFloat(_context(walker, done), value.replace("f", ""));
      },
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
