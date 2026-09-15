import { Expression } from "./Expression.ts";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import type { Type } from "./Type.ts";
import type { TypeTuple } from "./TypeTuple.ts";

export class ExpressionTupleSpread extends Expression {
  readonly #value: Expression;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ value }, done] = walker
      .expect("...", TokenTypeName.Operator)
      .extract("value", (s) => Expression.Parse(s, () => this, lookFor))
      .finish();
    super(walker.location, done, parent);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  resolution(invocationType: TypeTuple): Type {
    return this.#value.resolution(invocationType);
  }

  instruction(invocationType: TypeTuple): Instruction {
    return this.#value.instruction(invocationType);
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return this.#value.funcs(invocationType);
  }
}
