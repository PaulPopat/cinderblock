import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypeArray } from "./LinkedTypeArray.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionArrayAdd extends LinkedExpression {
  readonly #subject: LinkedExpression;
  readonly #addition: LinkedExpression;

  constructor(range: Range, subject: LinkedExpression, addition: LinkedExpression) {
    super(range);
    this.#subject = subject;
    this.#addition = addition;
  }

  get subject() {
    return this.#subject;
  }

  get addition() {
    return this.#addition;
  }

  get resolution() {
    return this.#subject.resolution;
  }

  get instruction(): Instruction {
    if (!(this.#subject.resolution instanceof LinkedTypeArray)) {
      throw new WriterError("Left must be array", this.range);
    }

    return {
      type: "array_add",
      left: this.#subject.instruction,
      right: this.#addition.instruction,
    };
  }

  get funcs(): Array<CreateFunc> {
    return [...this.#subject.funcs, ...this.#addition.funcs];
  }
}
