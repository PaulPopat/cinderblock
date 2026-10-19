import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionLiteralBool } from "#linked/LinkedExpressionLiteralBool";

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

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx.finish(() => new LinkedExpressionLiteralBool(this.range, this.#value));
  }
}
