import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import type { LinkedType } from "./LinkedType.ts";

export class LinkedExpressionOperatorAs extends LinkedExpression {
  readonly #left: LinkedExpression;
  readonly #right: LinkedType;

  constructor(range: Range, left: LinkedExpression, right: LinkedType) {
    super(range);
    this.#left = left;
    this.#right = right;
  }

  get resolution() {
    return this.#right;
  }

  get instruction(): Instruction {
    return this.#left.instruction;
  }

  get funcs(): Array<CreateFunc> {
    return this.#left.funcs;
  }
}
