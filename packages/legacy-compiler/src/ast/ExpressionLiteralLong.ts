import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import { LinkedExpressionLiteralLong } from "#linked/LinkedExpressionLiteralLong";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";

export class ExpressionLiteralLong extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^[0-9]+l$/gm,
      factory: (walker, namespace, lookFor, existing) => {
        const [{ value }, done] = walker.text("value", TokenTypeName.Number).finish();
        return new ExpressionLiteralLong(_context(walker, done, namespace), value.replace("l", ""));
      },
    });
  }

  readonly #value: string;

  constructor(ctx: EntryContext, value: string) {
    super(ctx);
    this.#value = value;
  }

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx.finish(() => new LinkedExpressionLiteralLong(this.range, this.#value));
  }
}
