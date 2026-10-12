import type { Instruction } from "#writer";
import { LinkedExpressionOperator } from "./LinkedExpressionOperator.ts";
import { LinkedTypePrimitiveBool } from "./LinkedTypePrimitiveBool.ts";
import { LinkedTypePrimitiveMaths } from "./LinkedTypePrimitiveMaths.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionOperatorLessThanOrEqualTo extends LinkedExpressionOperator {
  get resolution() {
    return new LinkedTypePrimitiveBool(this.range);
  }

  get instruction(): Instruction {
    if (!(this.left.resolution instanceof LinkedTypePrimitiveMaths)) {
      throw new WriterError("Boolean required", this.range);
    }

    if (!(this.right.resolution instanceof LinkedTypePrimitiveMaths)) {
      throw new WriterError("Boolean required", this.range);
    }

    return {
      type: "operator",
      operator: "less_than_or_equal_to",
      left: this.left.instruction,
      right: this.right.instruction,
    };
  }
}
