import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypePrimitiveString } from "./LinkedTypePrimitiveString.ts";

export class LinkedExpressionLiteralString extends LinkedExpression {
  readonly #value: string;

  constructor(range: Range, value: string) {
    super(range);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new LinkedTypePrimitiveString(this.range);
  }

  get instruction(): Instruction {
    return { type: "literal_string", value: this.#value };
  }

  get funcs(): Array<CreateFunc> {
    return [];
  }
}
