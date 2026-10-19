import { Expression } from "./Expression.ts";
import { TokenTypeName, TokenWalker } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionLet } from "#linked/LinkedExpressionLet";
import { LinkedExpressionTuple } from "#linked/LinkedExpressionTuple";

export class ExpressionTuplePart extends Expression {
  static Parse(walker: TokenWalker, lookFor: Array<string>) {
    const [{ name, value }, done] = walker
      .text("name", TokenTypeName.PropertyName)
      .expect("=", TokenTypeName.Operator)
      .extract("value", (s) => Expression.Parse(s, lookFor))
      .finish();

    return new ExpressionTuplePart(_context(walker, done), name.startsWith('"') ? JSON.parse(name) : name, value);
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

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx.with("value", (c) => this.#value.linked(left, c)).finish(({ value }) => new LinkedExpressionTuple(this.range, [[this.#name, value]]));
  }
}
