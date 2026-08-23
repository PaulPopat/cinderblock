import { VariablePrimitiveBool, VariablePrimitiveString, VariableTuple, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { WriterError } from "./WriterError.ts";

export class ExpressionOperatorIn extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^in$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected in", walker.store);
    const [{ right }, done] = walker
      .expect("in")
      .extract("right", (w) => Expression.ParseOne(w, () => this))
      .finish();
    super(walker.location, done, parent, existing, right);
  }

  get resolution() {
    return new TypePrimitiveBool(this.location, this.done, () => this);
  }

  async resolve(closure: Closure): Promise<Variable> {
    const left = await this.left.resolve(closure);
    const right = await this.right.resolve(closure);

    if (!(left instanceof VariablePrimitiveString)) {
      throw new WriterError("String required", this.location);
    }

    if (!(right instanceof VariableTuple)) {
      return new VariablePrimitiveBool(false);
    }

    return new VariablePrimitiveBool(right.has(left.value));
  }
}
