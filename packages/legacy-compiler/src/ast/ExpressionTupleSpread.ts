import { Expression } from "./Expression.ts";
import type { Entry } from "./Entry.ts";
import { TokenTypeName, TokenWalker } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import type { Type } from "./Type.ts";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionTupleSpread extends Expression {
  static Parse(walker: TokenWalker, lookFor: Array<string>) {
    const [{ value }, done] = walker
      .expect("...", TokenTypeName.Operator)
      .extract("value", (s) => Expression.Parse(s, lookFor))
      .finish();

    return new ExpressionTupleSpread(_context(walker, done), value);
  }

  readonly #value: Expression;

  constructor(ctx: EntryContext, value: Expression) {
    super(ctx);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }
}
