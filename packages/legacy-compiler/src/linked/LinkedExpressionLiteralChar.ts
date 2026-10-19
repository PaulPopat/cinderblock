import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypePrimitiveChar } from "./LinkedTypePrimitiveChar.ts";

export class LinkedExpressionLiteralChar extends LinkedExpression {
  readonly #value: string;

  constructor(range: Range, value: string) {
    super(range);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new LinkedTypePrimitiveChar(this.range);
  }

  get instruction(): Instruction {
    return { type: "literal_char", value: this.#value.charCodeAt(0) };
  }

  get funcs(): Array<CreateFunc> {
    return [];
  }
}
