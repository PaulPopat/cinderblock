import { LinkedTypeArg } from "./LinkedTypeArg.ts";
import { LinkedType } from "./LinkedType.ts";
import { Range } from "#utils";
import type { Shape } from "#writer";

export class LinkedTypeTuple extends LinkedType {
  static get empty() {
    return new LinkedTypeTuple(Range.empty, []);
  }

  readonly #args: Array<LinkedTypeArg>;

  constructor(range: Range, args: Array<LinkedTypeArg>) {
    super(range);
    this.#args = args;
  }

  get args() {
    return this.#args;
  }

  shape(): Shape {
    return {
      type: "tuple",
      args: this.#args.map((a) => ({ key: a.name, value: a.type.shape() })),
    };
  }

  compatible(input: LinkedType): boolean {
    return input instanceof LinkedTypeTuple && !this.#args.some((a) => !input.#args.some((b) => a.compatible(b)));
  }
}
