import type { TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { CreateFunc } from "#writer";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import type { TypeTuple } from "./TypeTuple.ts";

export abstract class ExpressionOperator extends Expression {
  readonly #left: Expression;
  readonly #right: Expression;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, left: Expression, right: Expression) {
    super(location, done, parent);
    this.#left = left;
    this.#right = right;
  }

  get left() {
    return this.#left;
  }

  get right() {
    return this.#right;
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return [...this.#left.funcs(invocationType), ...this.#right.funcs(invocationType)];
  }
}
