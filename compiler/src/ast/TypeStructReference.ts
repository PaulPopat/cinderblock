import type { Location } from "#utils";
import { Type } from "./Type.ts";

export class TypeStructReference extends Type {
  readonly #name: string;

  constructor(start: Location, end: Location, name: string) {
    super(start, end);
    this.#name = name;
  }

  get name() {
    return this.#name;
  }
}
