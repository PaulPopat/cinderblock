import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import type { LinkedType } from "./LinkedType.ts";
import { LinkedTypeArray } from "./LinkedTypeArray.ts";

export class LinkedExpressionLiteralArray extends LinkedExpression {
  readonly #value: Array<LinkedExpression>;
  readonly #contains: LinkedType;

  constructor(range: Range, value: Array<LinkedExpression>, contains: LinkedType) {
    super(range);
    this.#value = value;
    this.#contains = contains;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new LinkedTypeArray(this.range, this.#contains);
  }

  get instruction(): Instruction {
    return {
      type: "literal_array",
      subject: this.#value.map((v) => v.instruction),
    };
  }

  get funcs(): Array<CreateFunc> {
    return this.#value.flatMap((v) => v.funcs);
  }
}
