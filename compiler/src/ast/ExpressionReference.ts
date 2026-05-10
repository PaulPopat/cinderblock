import type { Location } from "#utils";
import { Expression } from "./Expression.ts";

export class ExpressionReference extends Expression {
  readonly #name: string;

  constructor(start: Location, end: Location, name: string) {
    super(start, end);
    this.#name = name;
  }

  get name() {
    return this.#name;
  }
}
