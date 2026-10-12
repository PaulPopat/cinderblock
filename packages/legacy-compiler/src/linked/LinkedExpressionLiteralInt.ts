import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypePrimitiveInt } from "./LinkedTypePrimitiveInt.ts";

export class LinkedExpressionLiteralInt extends LinkedExpression {
  readonly #value: string;

  constructor(range: Range, value: string) {
    super(range);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new LinkedTypePrimitiveInt(this.range);
  }

  get instruction(): Instruction {
    return { type: "literal_int", value: Number.parseInt(this.#value) };
  }

  get funcs(): Array<CreateFunc> {
    return [];
  }
}
