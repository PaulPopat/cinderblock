import type { Instruction } from "#writer";
import { LinkedExpressionOperator } from "./LinkedExpressionOperator.ts";
import { LinkedTypePrimitiveMaths } from "./LinkedTypePrimitiveMaths.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionOperatorSubtract extends LinkedExpressionOperator {
  get resolution() {
    return this.left.resolution;
  }

  get instruction(): Instruction {
    if (!(this.left.resolution instanceof LinkedTypePrimitiveMaths)) {
      throw new WriterError("Primitive required", this.range);
    }

    if (!(this.right.resolution instanceof LinkedTypePrimitiveMaths)) {
      throw new WriterError("Primitive required", this.range);
    }

    return {
      type: "operator",
      operator: "subtract",
      left: this.left.instruction,
      right: this.right.instruction,
    };
  }
}
