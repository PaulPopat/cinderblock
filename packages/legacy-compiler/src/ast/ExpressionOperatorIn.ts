import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";
import { TokenTypeName } from "#tokeniser";
import { _context } from "./EntryContext.ts";

export class ExpressionOperatorIn extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^in$/gm,
      factory: (walker, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected in", walker);
        const [{ right }, done] = walker
          .expect("in", TokenTypeName.Operator)
          .extract("right", (w) => Expression.ParseOne(w))
          .finish();

        return new ExpressionOperatorIn(_context(walker, done), existing, right);
      },
    });
  }
}
