import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypePrimitiveBool } from "./LinkedTypePrimitiveBool.ts";

export class LinkedExpressionLiteralBool extends LinkedExpression {
  readonly #value: boolean;

  constructor(range: Range, value: boolean) {
    super(range);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new LinkedTypePrimitiveBool(this.range);
  }

  get instruction(): Instruction {
    return { type: "literal_bool", value: this.#value };
  }

  get funcs(): Array<CreateFunc> {
    return [];
  }
}
