import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypePrimitiveDouble } from "./LinkedTypePrimitiveDouble.ts";

export class LinkedExpressionLiteralDouble extends LinkedExpression {
  readonly #value: string;

  constructor(range: Range, value: string) {
    super(range);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new LinkedTypePrimitiveDouble(this.range);
  }

  get instruction(): Instruction {
    return { type: "literal_double", value: this.#value };
  }

  get funcs(): Array<CreateFunc> {
    return [];
  }
}
