import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypePrimitiveNull } from "./LinkedTypePrimitiveNull.ts";

export class LinkedExpressionLiteralNull extends LinkedExpression {
  get resolution() {
    return new LinkedTypePrimitiveNull(this.range);
  }

  get instruction(): Instruction {
    return { type: "literal_null" };
  }

  get funcs(): Array<CreateFunc> {
    return [];
  }
}
