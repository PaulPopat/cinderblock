import type { Instruction } from "#writer";
import { LinkedExpressionOperator } from "./LinkedExpressionOperator.ts";
import { LinkedTypePrimitiveBool } from "./LinkedTypePrimitiveBool.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionOperatorAnd extends LinkedExpressionOperator {
  get resolution() {
    return this.left.resolution;
  }

  get instruction(): Instruction {
    if (!(this.left.resolution instanceof LinkedTypePrimitiveBool)) {
      throw new WriterError("Bool required", this.range);
    }

    if (!(this.right.resolution instanceof LinkedTypePrimitiveBool)) {
      throw new WriterError("Bool required", this.range);
    }

    return {
      type: "operator",
      operator: "and",
      left: this.left.instruction,
      right: this.right.instruction,
    };
  }
}
