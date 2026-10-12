import type { CreateFunc } from "#writer";
import { Range } from "#utils";
import { LinkedEntry } from "./LinkedEntry.ts";
import type { LinkedType } from "./LinkedType.ts";

export class LinkedExternal extends LinkedEntry {
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

  get model(): CreateFunc[] {
    return [];
  }
}
