import type { Instruction } from "#writer";
import { LinkedExpressionOperator } from "./LinkedExpressionOperator.ts";
import { LinkedTypePrimitiveMaths } from "./LinkedTypePrimitiveMaths.ts";
import { LinkedTypePrimitiveString } from "./LinkedTypePrimitiveString.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionOperatorAdd extends LinkedExpressionOperator {
  get resolution() {
    return this.left.resolution;
  }

  get instruction(): Instruction {
    if (this.left.resolution instanceof LinkedTypePrimitiveMaths && this.right.resolution instanceof LinkedTypePrimitiveMaths) {
      return {
        type: "operator",
        operator: "add",
        left: this.left.instruction,
        right: this.right.instruction,
      };
    }

    if (this.left.resolution instanceof LinkedTypePrimitiveString && this.right.resolution instanceof LinkedTypePrimitiveString) {
      return {
        type: "operator",
        operator: "add",
        left: this.left.instruction,
        right: this.right.instruction,
      };
    }

    throw new WriterError("Invalid Maths", this.range);
  }
}
