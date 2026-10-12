import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TokenTypeName } from "#tokeniser";
import { _context } from "./EntryContext.ts";

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
}
