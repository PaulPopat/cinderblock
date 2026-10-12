import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypeArray } from "./LinkedTypeArray.ts";
import { LinkedTypePrimitiveNull } from "./LinkedTypePrimitiveNull.ts";
import { LinkedTypeUnion } from "./LinkedTypeUnion.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionIndex extends LinkedExpression {
  readonly #subject: LinkedExpression;
  readonly #key: LinkedExpression;

  constructor(range: Range, subject: LinkedExpression, key: LinkedExpression) {
    super(range);
    this.#subject = subject;
    this.#key = key;
  }

  get resolution() {
    let subjectType = this.#subject.resolution;
    if (!(subjectType instanceof LinkedTypeArray)) {
      throw new WriterError("Subject is not indexable", this.range);
    }

    return new LinkedTypeUnion(this.range, [new LinkedTypePrimitiveNull(this.range), subjectType.contains]);
  }

  get instruction(): Instruction {
    let subjectType = this.#subject.resolution;
    if (!(subjectType instanceof LinkedTypeArray)) {
      throw new WriterError("Subject is not indexable", this.range);
    }

    return {
      type: "index",
      subject: this.#subject.instruction,
      index: this.#key.instruction,
    };
  }

  get funcs(): Array<CreateFunc> {
    return this.#subject.funcs;
  }
}
