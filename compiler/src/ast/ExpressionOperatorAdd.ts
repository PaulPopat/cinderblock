import { VariablePrimitive, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";

export class ExpressionOperatorAdd extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\+$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected +", walker.store);
    const [{ right }, done] = walker
      .expect("+")
      .extract("right", (w) => Expression.ParseOne(w, parent))
      .finish();
    super(walker.location, done, parent, existing, right);
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

    return left.add(right);
  }
}
