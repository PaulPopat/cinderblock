import type { Instruction } from "#writer";
import { LinkedExpressionOperator } from "./LinkedExpressionOperator.ts";
import { LinkedTypePrimitiveBool } from "./LinkedTypePrimitiveBool.ts";
import { LinkedTypePrimitiveString } from "./LinkedTypePrimitiveString.ts";
import { LinkedTypeTuple } from "./LinkedTypeTuple.ts";
import { LinkedTypeUnion } from "./LinkedTypeUnion.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionOperatorIn extends LinkedExpressionOperator {
  get resolution() {
    return new LinkedTypePrimitiveBool(this.range);
  }

  get instruction(): Instruction {
    if (!(this.left.resolution instanceof LinkedTypePrimitiveString)) {
      throw new WriterError("String required", this.range);
    }

    if (!(this.right.resolution instanceof LinkedTypeTuple) && !(this.right.resolution instanceof LinkedTypeUnion)) {
      throw new WriterError("Tuple required", this.range);
    }

    return {
      type: "operator",
      operator: "in",
      left: this.left.instruction,
      right: this.right.instruction,
    };
  }
}
