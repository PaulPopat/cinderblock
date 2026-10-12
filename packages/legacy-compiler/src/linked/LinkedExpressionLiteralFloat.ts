import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypePrimitiveFloat } from "./LinkedTypePrimitiveFloat.ts";

export class LinkedExpressionLiteralFloat extends LinkedExpression {
  readonly #value: string;

  constructor(range: Range, value: string) {
    super(range);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new LinkedTypePrimitiveFloat(this.range);
  }

  get instruction(): Instruction {
    return { type: "literal_float", value: Number.parseFloat(this.#value) };
  }

  get funcs(): Array<CreateFunc> {
    return [];
  }
}
