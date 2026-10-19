import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import { LinkedExpressionLiteralFloat } from "#linked/LinkedExpressionLiteralFloat";
import type { LinkerContext } from "./LinkerContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";

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

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx.finish(() => new LinkedExpressionLiteralFloat(this.range, this.#value));
  }
}
