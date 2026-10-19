import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TokenTypeName } from "#tokeniser";
import { _context } from "./EntryContext.ts";
import { LinkedExpressionLiteralNull } from "#linked/LinkedExpressionLiteralNull";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";

export class ExpressionLiteralNull extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^null$/gm,
      factory: (walker, lookFor, existing) => {
        const [, done] = walker.expect("null", TokenTypeName.KeyWord).finish();

        return new ExpressionLiteralNull(_context(walker, done));
      },
    });
  }

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx.finish(() => new LinkedExpressionLiteralNull(this.range));
  }
}
