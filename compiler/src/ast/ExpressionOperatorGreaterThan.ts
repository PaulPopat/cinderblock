import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";

export class ExpressionOperatorGreaterThan extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^>$/gm,
      parse: (w, lookFor, e) => {
        if (!e) throw new ParserError("Unexpected >", w.store);
        return w
          .expect(">")
          .extract("right", (w) => Expression.Parse(w, lookFor))
          .finish(
            ({ right }, ctx) =>
              new ExpressionOperatorGreaterThan(ctx, e, right),
          );
      },
    });
  }

  get resolution() {
    return this.left.resolution;
  }
}
