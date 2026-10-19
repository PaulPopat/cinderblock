import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedExpressionLet } from "./LinkedExpressionLet.ts";
import { LinkedExternal } from "./LinkedExternal.ts";
import { LinkedTypeArg } from "./LinkedTypeArg.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionReference extends LinkedExpression {
  readonly #subject: LinkedExpression | LinkedTypeArg;

  constructor(range: Range, subject: LinkedExpression | LinkedTypeArg) {
    super(range);
    this.#subject = subject;
  }

  get resolution() {
    return this.#subject instanceof LinkedExpression ? this.#subject.resolution : this.#subject.type;
  }

  get instruction(): Instruction {
    if (this.#subject instanceof LinkedExpressionLet) {
      return { type: "reference", name: this.#subject.name };
    } else if (this.#subject instanceof LinkedTypeArg) {
      return { type: "arg", name: this.#subject.name };
    } else if (this.#subject instanceof LinkedExternal) {
      return { type: "external", name: this.#subject.name };
    }

    throw new WriterError("Unknown subject type", this.range);
  }

  get funcs(): Array<CreateFunc> {
    return this.#subject instanceof LinkedExpression ? this.#subject.funcs : [];
  }
}
