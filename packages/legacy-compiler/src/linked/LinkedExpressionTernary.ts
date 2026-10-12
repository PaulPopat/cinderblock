import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypePrimitiveBool } from "./LinkedTypePrimitiveBool.ts";
import { LinkedTypeUnion } from "./LinkedTypeUnion.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionTernary extends LinkedExpression {
  readonly #predicate: LinkedExpression;
  readonly #positive: LinkedExpression;
  readonly #negative: LinkedExpression;

  constructor(range: Range, predicate: LinkedExpression, positive: LinkedExpression, negative: LinkedExpression) {
    super(range);
    this.#predicate = predicate;
    this.#positive = positive;
    this.#negative = negative;
  }

  get predicate() {
    return this.#predicate;
  }

  get positive() {
    return this.#positive;
  }

  get negative() {
    return this.#negative;
  }

  get resolution() {
    return new LinkedTypeUnion(this.range, [this.#positive.resolution, this.#negative.resolution]);
  }

  get instruction(): Instruction {
    if (!(this.#predicate.resolution instanceof LinkedTypePrimitiveBool)) {
      throw new WriterError("Boolean required", this.range);
    }

    return {
      type: "ternary",
      predicate: this.#predicate.instruction,
      positive: this.#positive.instruction,
      negative: this.#negative.instruction,
    };
  }

  get funcs(): Array<CreateFunc> {
    return [...this.#predicate.funcs, ...this.#positive.funcs, ...this.#negative.funcs];
  }
}
