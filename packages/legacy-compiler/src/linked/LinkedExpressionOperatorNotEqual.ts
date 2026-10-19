import type { Instruction } from "#writer";
import { LinkedExpressionOperator } from "./LinkedExpressionOperator.ts";
import { LinkedTypePrimitive } from "./LinkedTypePrimitive.ts";
import { LinkedTypePrimitiveBool } from "./LinkedTypePrimitiveBool.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionOperatorNotEquals extends LinkedExpressionOperator {
  get resolution() {
    return new LinkedTypePrimitiveBool(this.range);
  }

  get instruction(): Instruction {
    if (!(this.left.resolution instanceof LinkedTypePrimitive)) {
      throw new WriterError("Boolean required", this.range);
    }

    if (!(this.right.resolution instanceof LinkedTypePrimitive)) {
      throw new WriterError("Boolean required", this.range);
    }

    return {
      type: "operator",
      operator: "not_equals",
      left: this.left.instruction,
      right: this.right.instruction,
    };
  }
}
