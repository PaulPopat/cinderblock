import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";

export class ExpressionOperatorAdd extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\+$/gm,
      parse: (w, e) => {
        if (!e) throw new ParserError("Unexpected +", w.store);
        return w
          .expect("+")
          .extract("right", Expression.Parse)
          .finish(({ right }, ctx) => new ExpressionOperatorAdd(ctx, e, right));
      },
    });
  }
}
