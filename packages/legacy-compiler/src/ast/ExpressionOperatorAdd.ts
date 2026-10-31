import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";
import { TokenTypeName } from "#tokeniser";
import { _context } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionOperatorAdd } from "#linked/LinkedExpressionOperatorAdd";

export class ExpressionOperatorAdd extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\+$/gm,
      factory: (walker, namespace, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected +", walker);
        const [{ right }, done] = walker
          .expect("+", TokenTypeName.Operator)
          .extract("right", (w) => Expression.ParseOne(w, namespace))
          .finish();

        return new ExpressionOperatorAdd(_context(walker, done, namespace), existing, right);
      },
    });
  }

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx
      .with("left", (c) => this.left.linked(left, c))
      .with("right", (c, { left }) => this.right.linked(left, c))
      .finish(({ left, right }) => new LinkedExpressionOperatorAdd(this.range, left, right));
  }
}
