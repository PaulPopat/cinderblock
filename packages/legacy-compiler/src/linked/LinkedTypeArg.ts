import type { Range } from "#utils";
import type { ShapeArg } from "#writer";
import { LinkedType } from "./LinkedType.ts";

export class LinkedTypeArg extends LinkedType {
  readonly #type: LinkedType;
  readonly #name: string;

  constructor(range: Range, type: LinkedType, name: string) {
    super(range);
    this.#type = type;
    this.#name = name.startsWith('"') ? JSON.parse(name) : name;
  }

  get type() {
    return this.#type;
  }

  get name() {
    return this.#name;
  }

  shape(): ShapeArg {
    return { type: "arg", name: this.#name, value: this.#type.shape() };
  }

  compatible(input: LinkedType): boolean {
    return input instanceof LinkedTypeArg && input.name === this.name && this.type.compatible(input.type);
  }
}
