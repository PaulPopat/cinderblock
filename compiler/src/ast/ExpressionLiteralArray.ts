import { VariableArray, VariablePrimitiveBool, type Closure, type Variable } from "#runner";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TypeArray } from "./TypeArray.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { TypePrimitiveChar } from "./TypePrimitiveChar.ts";

export class ExpressionLiteralArray extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^\[$/gm,
      parse: (w, lookFor) =>
        w
          .while(
            "value",
            (w) => w.data === "[" || w.data === ",",
            (s) => Expression.Parse(s.next, [...lookFor, ",", "]"]),
          )
          .expect("]")
          .finish(({ value }, ctx) => new ExpressionLiteralArray(ctx, value)),
    });
  }

  readonly #value: Array<Expression>;

  constructor(ctx: EntryContext, value: Array<Expression>) {
    super(ctx);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  get resolution() {
    return new TypeArray(this.ctx, this.#value[0]?.resolution ?? new TypePrimitiveBool(this.ctx));
  }

  async resolve(closure: Closure): Promise<Variable> {
    return new VariableArray(await Promise.all(this.#value.map((v) => v.resolve(closure))));
  }
}
