import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TokenTypeName } from "#tokeniser";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { _context } from "./EntryContext.ts";

export class ExpressionOperatorDirectPipe extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^-->$/gm,
      factory: (walker, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected -->", walker);
        const [{ right }, done] = walker
          .expect("-->", TokenTypeName.Operator)
          .extract("right", (w) => Expression.ParseOne(w))
          .finish();

        return new ExpressionOperatorDirectPipe(_context(walker, done), existing, right);
      },
    });
  }
}
