import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { WriterError } from "./WriterError.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";
import type { Type } from "./Type.ts";
import type { TypeTuple } from "./TypeTuple.ts";

export class ExpressionOperatorAnd extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^&&$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected &&", walker);
    const [{ right }, done] = walker
      .expect("&&", TokenTypeName.Operator)
      .extract("right", (w) => Expression.ParseOne(w, parent))
      .finish();
    super(walker.location, done, parent, existing, right);
  }

  resolution(invocationType: TypeTuple): Type {
    return new TypePrimitiveBool(this.location, this.done, () => this);
  }

  instruction(invocationType: TypeTuple): Instruction {
    if (!(this.left.resolution(invocationType) instanceof TypePrimitiveBool)) {
      throw new WriterError("Boolean required", this.range);
    }

    if (!(this.right.resolution(invocationType) instanceof TypePrimitiveBool)) {
      throw new WriterError("Boolean required", this.range);
    }

    return {
      type: "operator",
      operator: "and",
      left: this.left.instruction(invocationType),
      right: this.right.instruction(invocationType),
    };
  }
}
