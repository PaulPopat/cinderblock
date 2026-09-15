import { Expression } from "./Expression.ts";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";

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

  get resolution() {
    return this.#value.resolution;
  }

  get instruction(): Instruction {
    return this.#value.instruction;
  }

  get funcs(): CreateFunc[] {
    return this.#value.funcs;
  }
}
