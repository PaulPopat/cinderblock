import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";
import { type Closure, type Variable, VariablePrimitive } from "#runner";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { WriterError } from "./WriterError.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";
import { TypePrimitive } from "./TypePrimitive.ts";

export class ExpressionOperatorGreaterThan extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^>$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected >", walker);
    const [{ right }, done] = walker
      .expect(">", TokenTypeName.Operator)
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

    if (!(left instanceof VariablePrimitive)) {
      throw new WriterError("Primitive required", this.location);
    }

    if (!(right instanceof VariablePrimitive)) {
      throw new WriterError("Primitive required", this.location);
    }

    return left.greater_than(right);
  }

  get instruction(): Instruction {
    if (!(this.left.resolution instanceof TypePrimitive)) {
      throw new WriterError("Boolean required", this.location);
    }

    if (!(this.right.resolution instanceof TypePrimitive)) {
      throw new WriterError("Boolean required", this.location);
    }

    return {
      type: "operator",
      operator: "greater_than",
      left: this.left.instruction,
      right: this.right.instruction,
    };
  }
}
