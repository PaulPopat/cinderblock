import type { Range } from "#utils";
import type { Shape } from "#writer";
import { LinkedType } from "./LinkedType.ts";
import type { LinkedTypeArg } from "./LinkedTypeArg.ts";

export class LinkedTypePipeable extends LinkedType {
  readonly #args: Array<LinkedTypeArg>;
  readonly #returns: LinkedType;

  constructor(range: Range, args: Array<LinkedTypeArg>, returns: LinkedType) {
    super(range);
    this.#args = args;
    this.#returns = returns;
  }

  get args() {
    return this.#args;
  }

  get returns() {
    return this.#returns;
  }

  shape(): Shape {
    return { type: "pipeable", args: this.#args.map((a) => a.shape()), returns: this.#returns.shape() };
  }

  compatible(input: LinkedType): boolean {
    return (
      input instanceof LinkedTypePipeable &&
      !input.args.some((a) => !this.args.some((b) => b.compatible(a))) &&
      this.returns.compatible(input.returns)
    );
  }
}
