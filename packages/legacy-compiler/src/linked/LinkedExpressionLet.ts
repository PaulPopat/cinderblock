import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import type { LinkedType } from "./LinkedType.ts";
import type { LinkedTypeArg } from "./LinkedTypeArg.ts";
import { LinkedTypePipeable } from "./LinkedTypePipeable.ts";

export class LinkedExpressionLet extends LinkedExpression {
  readonly #name: string;
  readonly #args: Array<LinkedTypeArg>;
  readonly #returns: LinkedType;
  readonly #children: Array<LinkedExpressionLet>;
  readonly #contents: LinkedExpression;

  constructor(
    range: Range,
    name: string,
    args: Array<LinkedTypeArg>,
    returns: LinkedType,
    children: Array<LinkedExpressionLet>,
    contents: LinkedExpression,
  ) {
    super(range);
    this.#name = name;
    this.#args = args;
    this.#returns = returns;
    this.#children = children;
    this.#contents = contents;
  }

  get name() {
    return this.#name;
  }

  get args() {
    return this.#args;
  }

  get resolution() {
    return new LinkedTypePipeable(this.range, this.#args, this.#returns);
  }

  get instruction(): Instruction {
    return { type: "reference", name: this.#name };
  }

  get funcs(): Array<CreateFunc> {
    return [
      {
        name: this.#name,
        vars: [...this.#children.flatMap((e) => e.funcs), ...this.#contents.funcs],
        returns: this.#contents.instruction,
        no_args: false,
        tags: {},
      },
    ];
  }
}
