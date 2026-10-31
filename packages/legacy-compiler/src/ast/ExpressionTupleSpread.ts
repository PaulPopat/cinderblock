import { Expression } from "./Expression.ts";
import { TokenTypeName, TokenWalker } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionLet } from "#linked/LinkedExpressionLet";
import { LinkedExpressionTuple } from "#linked/LinkedExpressionTuple";
import { LinkedTypeTuple } from "#linked/LinkedTypeTuple";
import { LinkerError } from "./LinkerError.ts";
import { LinkedExpressionAccess } from "#linked/LinkedExpressionAccess";
import { LinkedExpressionReference } from "#linked/LinkedExpressionReference";

export class ExpressionTupleSpread extends Expression {
  static Parse(walker: TokenWalker, namespace: string, lookFor: Array<string>) {
    const [{ name, value }, done] = walker
      .expect("...", TokenTypeName.Operator)
      .internal("name")
      .extract("value", (s) => Expression.Parse(s, namespace, lookFor))
      .finish();

    return new ExpressionTupleSpread(_context(walker, done, namespace), name, value);
  }

  readonly #name: string;
  readonly #value: Expression;

  constructor(ctx: EntryContext, name: string, value: Expression) {
    super(ctx);
    this.#name = name;
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx
      .with("value", (c) => this.#value.linked(left, c))
      .finish(({ value }) => {
        const result = value.resolution;
        if (!(result instanceof LinkedTypeTuple)) {
          throw new LinkerError("Tuple required", this.range);
        }
        const store = new LinkedExpressionLet(this.range, this.#name, [], value.resolution, [], value);

        return new LinkedExpressionTuple(
          this.range,
          result.args.map((a) => [a.name, new LinkedExpressionAccess(this.range, new LinkedExpressionReference(this.range, store), a.name)]),
        );
      });
  }
}
