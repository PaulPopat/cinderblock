import { type Closure, type Variable, VariablePrimitive, VariablePrimitiveBool } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { WriterError } from "./WriterError.ts";

export class ExpressionOperatorAnd extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^&&$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected &&", walker.store);
    const [{ right }, done] = walker
      .expect("&&")
      .extract("right", (w) => Expression.ParseOne(w, parent))
      .finish();
    super(walker.location, done, parent, existing, right);
  }

  get resolution() {
    return new TypePrimitiveBool(this.location, this.done, () => this);
  }

  async resolve(closure: Closure): Promise<Variable> {
    const left = await this.left.resolve(closure);

    if (!(left instanceof VariablePrimitiveBool)) {
      throw new WriterError("Boolean required", this.location);
    }

    if (!left.value) {
      return new VariablePrimitiveBool(false);
    }

    const right = await this.right.resolve(closure);
    if (!(right instanceof VariablePrimitiveBool)) {
      throw new WriterError("Boolean required", this.location);
    }

    return new VariablePrimitiveBool(right.value);
  }
}
