import { LinkedExpression } from "./LinkedExpression.ts";
import { WriterError } from "./WriterError.ts";
import type { CreateFunc, Instruction } from "#writer";
import type { Range } from "#utils";
import { LinkedTypeTuple } from "./LinkedTypeTuple.ts";

export class LinkedExpressionAccess extends LinkedExpression {
  readonly #subject: LinkedExpression;
  readonly #name: string;

  constructor(range: Range, subject: LinkedExpression, name: string) {
    super(range);
    this.#subject = subject;
    this.#name = name;
  }

  get subject() {
    return this.#subject;
  }

  get name() {
    return this.#name;
  }

  get resolution() {
    let subjectType = this.#subject.resolution;
    if (!(subjectType instanceof LinkedTypeTuple)) {
      throw new WriterError("Subject is not accessible", this.range);
    }

    const property = subjectType.args.find((a) => a.name === this.#name);

    if (!property) throw new WriterError("Could not find property", this.range);

    return property.type;
  }

  get instruction(): Instruction {
    const subjectType = this.#subject.resolution;

    if (!(subjectType instanceof LinkedTypeTuple)) {
      throw new WriterError("Left must be a tuple", this.range);
    }

    if (!subjectType.args.some((a) => a.name === this.#name)) {
      throw new WriterError("Could not find property", this.range);
    }

    return {
      type: "access",
      subject: this.#subject.instruction,
      key: this.#name,
    };
  }

  get funcs(): Array<CreateFunc> {
    return this.#subject.funcs;
  }
}
