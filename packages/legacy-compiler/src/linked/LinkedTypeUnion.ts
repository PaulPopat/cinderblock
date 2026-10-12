import type { Range } from "#utils";
import type { Shape } from "#writer";
import { LinkedType } from "./LinkedType.ts";

export class LinkedTypeUnion extends LinkedType {
  readonly #parts: Array<LinkedType>;

  constructor(range: Range, parts: Array<LinkedType>) {
    super(range);
    this.#parts = parts;
  }

  get parts() {
    return this.#parts;
  }

  shape(): Shape {
    return { type: "union", args: this.#parts.map((p) => p.shape()) };
  }

  compatible(input: LinkedType): boolean {
    if (input instanceof LinkedTypeUnion) {
      return !input.parts.some((a) => !this.#parts.some((b) => b.compatible(a)));
    }

    return this.#parts.some((p) => p.compatible(input));
  }
}
