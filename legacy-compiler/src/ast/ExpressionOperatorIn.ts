import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { WriterError } from "./WriterError.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";
import { TypePrimitiveString } from "./TypePrimitiveString.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { TypeReference } from "./TypeReference.ts";
import { TypeUnion } from "./TypeUnion.ts";
import { TypeIntersection } from "./TypeIntersection.ts";
import type { Type } from "./Type.ts";

export class ExpressionOperatorIn extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^in$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected in", walker);
    const [{ right }, done] = walker
      .expect("in", TokenTypeName.Operator)
      .extract("right", (w) => Expression.ParseOne(w, () => this))
      .finish();
    super(walker.location, done, parent, existing, right);
  }

  resolution(invocationType: TypeTuple): Type {
    return new TypePrimitiveBool(this.location, this.done, () => this);
  }

  instruction(invocationType: TypeTuple): Instruction {
    if (!(this.left.resolution(invocationType) instanceof TypePrimitiveString)) {
      throw new WriterError("String required", this.range);
    }

    if (
      !(this.right.resolution(invocationType) instanceof TypeTuple) &&
      !(this.right.resolution(invocationType) instanceof TypeReference) &&
      !(this.right.resolution(invocationType) instanceof TypeUnion) &&
      !(this.right.resolution(invocationType) instanceof TypeIntersection)
    ) {
      throw new WriterError("Tuple required", this.range);
    }

    return {
      type: "operator",
      operator: "in",
      left: this.left.instruction(invocationType),
      right: this.right.instruction(invocationType),
    };
  }
}
