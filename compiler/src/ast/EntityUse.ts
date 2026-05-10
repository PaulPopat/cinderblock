import type { Location } from "#utils";
import { Entity } from "./Entity.ts";

export class EntityUse extends Entity {
  readonly #namespace: string;

  constructor(start: Location, end: Location, namespace: string) {
    super(start, end);
    this.#namespace = namespace;
  }

  get namespace() {
    return this.#namespace;
  }
}
