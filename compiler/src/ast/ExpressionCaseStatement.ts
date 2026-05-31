import { Arg } from "./Arg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";

export class ExpressionCaseStatement extends Expression {
  readonly #arg: Arg;
  readonly #expression: Expression;

  constructor(ctx: EntryContext, arg: Arg, expression: Expression) {
    super(ctx);
    this.#arg = arg;
    this.#expression = expression;
  }

  get arg() {
    return this.#arg;
  }

  get expression() {
    return this.#expression;
  }
}
