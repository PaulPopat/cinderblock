import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";
import { type Closure, type Variable, VariablePrimitive } from "#runner";

export class ExpressionOperatorOr extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\|\|$/gm,
      parse: (w, lookFor, e) => {
        if (!e) throw new ParserError("Unexpected ||", w.store);
        return w
          .expect("||")
          .extract("right", (w) => Expression.Parse(w, lookFor))
          .finish(({ right }, ctx) => new ExpressionOperatorOr(ctx, e, right));
      },
    });
  }

  get resolution() {
    return this.left.resolution;
  }

  async resolve(closure: Closure): Promise<Variable> {
    const left = await this.left.resolve(closure);
    const right = await this.right.resolve(closure);

    if (!(left instanceof VariablePrimitive)) {
      throw new Error("Primitive required");
    }

    if (!(right instanceof VariablePrimitive)) {
      throw new Error("Primitive required");
    }

    return left.or(right);
  }
}
