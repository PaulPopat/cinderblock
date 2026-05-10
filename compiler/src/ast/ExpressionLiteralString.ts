import type { Location } from "#utils";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";

export class ExpressionLiteralString extends ExpressionLiteral {
  readonly #value: string;

  constructor(start: Location, end: Location, value: string) {
    super(start, end);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }
}
