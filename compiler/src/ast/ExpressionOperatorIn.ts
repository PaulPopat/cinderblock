import { VariablePrimitiveBool, VariablePrimitiveString, VariableTuple, type Closure, type Variable } from "#runner";
import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";

export class ExpressionOperatorIn extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^in$/gm,
      parse: (w, lookFor, e) => {
        if (!e) throw new ParserError("Unexpected in", w.store);
        return w
          .expect("in")
          .extract("right", (w) => Expression.Parse(w, lookFor))
          .finish(({ right }, ctx) => new ExpressionOperatorIn(ctx, e, right));
      },
    });
  }

  get resolution() {
    return this.right.resolution;
  }

  resolve(closure: Closure): Variable {
    const left = this.left.resolve(closure);
    const right = this.right.resolve(closure);

    if (!(left instanceof VariablePrimitiveString)) {
      throw new Error("String required");
    }

    if (!(right instanceof VariableTuple)) {
      throw new Error("Tuple required");
    }

    return new VariablePrimitiveBool(right.has(left.value));
  }
}
