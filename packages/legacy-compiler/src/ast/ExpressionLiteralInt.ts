import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import { LinkedExpressionLiteralInt } from "#linked/LinkedExpressionLiteralInt";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";

export class ExpressionLiteralInt extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /[0-9]+i?$/gm,
      factory: (walker, lookFor, existing) => {
        const [{ value }, done] = walker.text("value", TokenTypeName.Number).finish();
        return new ExpressionLiteralInt(_context(walker, done), value.replace("i", ""));
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
    return ctx.finish(() => new LinkedExpressionLiteralInt(this.range, this.#value));
  }
}
