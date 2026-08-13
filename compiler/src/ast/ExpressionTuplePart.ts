import { TypeArg } from "./TypeArg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { VariableTuple, type Closure, type Variable } from "#runner";

export class ExpressionTuplePart extends Expression {
  readonly #name: string;
  readonly #value: Expression;

  constructor(ctx: EntryContext, name: string, value: Expression) {
    super(ctx);
    this.#name = name;
    this.#value = value;
  }

  get name() {
    return this.#name;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypeTuple(this.ctx, [new TypeArg(this.ctx, this.#value.resolution, this.#name)]);
  }

  resolve(closure: Closure): Variable {
    return new VariableTuple({
      [this.#name]: this.#value.resolve(closure),
    });
  }
}
