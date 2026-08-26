import { VariablePrimitiveBool, VariablePrimitiveNull, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";

export class ExpressionLiteralNull extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^null$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [, done] = walker.expect("null").finish();
    super(walker.location, done, parent);
  }

  get resolution() {
    return new TypePrimitiveBool(this.location, this.done, () => this);
  }

  async resolve(closure: Closure): Promise<Variable> {
    return new VariablePrimitiveNull(null);
  }
}
