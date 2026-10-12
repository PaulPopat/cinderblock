import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypePrimitiveBool } from "./LinkedTypePrimitiveBool.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionNot extends LinkedExpression {
  readonly #subject: LinkedExpression;

  constructor(range: Range, subject: LinkedExpression) {
    super(range);
    this.#subject = subject;
  }

  get subject() {
    return this.#subject;
  }

  get resolution() {
    let subjectType = this.#subject.resolution;
    if (!(subjectType instanceof LinkedTypePrimitiveBool)) {
      throw new WriterError("Boolean required", this.range);
    }

    return new LinkedTypePrimitiveBool(this.range);
  }

  get instruction(): Instruction {
    if (!(this.#subject.resolution instanceof LinkedTypePrimitiveBool)) {
      throw new WriterError("Boolean required", this.range);
    }

    return { type: "not", subject: this.#subject.instruction };
  }

  get funcs(): Array<CreateFunc> {
    return [...this.#subject.funcs];
  }
}
