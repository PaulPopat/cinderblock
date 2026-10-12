import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import type { Type } from "./Type.ts";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionLiteralBool extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^(true|false)$/gm,
      factory: (walker, lookFor, existing) => {
        const [{ value }, done] = walker.text("value", TokenTypeName.KeyWord).finish();
        return new ExpressionLiteralBool(_context(walker, done), value === "true");
      },
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
}
