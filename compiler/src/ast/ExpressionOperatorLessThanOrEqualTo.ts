import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { WriterError } from "./WriterError.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";
import { TypePrimitive } from "./TypePrimitive.ts";

export class ExpressionOperatorLessThanOrEqualTo extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^<=$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected <=", walker);
    const [{ right }, done] = walker
      .expect("<=", TokenTypeName.Operator)
      .extract("right", (w) => Expression.ParseOne(w, () => this))
      .finish();
    super(walker.location, done, parent, existing, right);
  }

  get resolution() {
    return new TypePrimitiveBool(this.location, this.done, () => this);
  }

  get instruction(): Instruction {
    if (!(this.left.resolution instanceof TypePrimitive)) {
      throw new WriterError("Primitive required", this.range);
    }

    if (!(this.right.resolution instanceof TypePrimitive)) {
      throw new WriterError("Primitive required", this.range);
    }

    return {
      type: "operator",
      operator: "less_than_or_equal_to",
      left: this.left.instruction,
      right: this.right.instruction,
    };
  }
}
