import type { CreateFunc, Instruction } from "#writer";
import { Range } from "#utils";
import type { LinkedType } from "./LinkedType.ts";
import { LinkedExpression } from "./LinkedExpression.ts";

export class LinkedExternal extends LinkedExpression {
  readonly #name: string;
  readonly #type: LinkedType;

  constructor(range: Range, name: string, type: LinkedType) {
    super(range);
    this.#name = name;
    this.#type = type;
  }

  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
  }

  get resolution(): LinkedType {
    return this.#type;
  }

  get instruction(): Instruction {
    throw new Error("Method not implemented.");
  }

  get funcs(): CreateFunc[] {
    return [];
  }
}
