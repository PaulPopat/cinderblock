import { TypeArg } from "./TypeArg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TypeTuple } from "./TypeTuple.ts";
import type { Closure, Variable } from "#runner";

export class ExpressionTuplePart extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^:$/gm,
      parse: (w, _, left) => {
        if (!left) throw new ParserError("Unexpected :", w.store);
        return w
          .expect(":")
          .text("name")
          .finish(({ name }, ctx) => new ExpressionTuplePart(ctx, name, left));
      },
    });
  }

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
    throw new Error("Not implemented");
  }
}
