import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import { LinkedTypeArg } from "./LinkedTypeArg.ts";
import { LinkedTypeTuple } from "./LinkedTypeTuple.ts";

export class LinkedExpressionTuple extends LinkedExpression {
  readonly #parts: Array<[string, LinkedExpression]>;

  constructor(range: Range, parts: Array<[string, LinkedExpression]>) {
    super(range);
    this.#parts = parts;
  }

  get parts() {
    return this.#parts;
  }

  get resolution() {
    return new LinkedTypeTuple(
      this.range,
      this.#parts.map(([key, value]) => new LinkedTypeArg(value.range, value.resolution, key)),
    );
  }

  get instruction(): Instruction {
    return {
      type: "tuple",
      parts: this.#parts
        .map(([key, value]): [string, Instruction] => [key, value.instruction])
        .filter(([p], i, a) => a.findLastIndex(([s]) => s === p) === i),
    };
  }

  get funcs(): Array<CreateFunc> {
    return this.#parts.flatMap(([, p]) => p.funcs);
  }
}
