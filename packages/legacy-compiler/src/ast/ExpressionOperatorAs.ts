import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import { LinkedExpressionOperatorAs } from "#linked/LinkedExpressionOperatorAs";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";

export class ExpressionOperatorAs extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^as$/gm,
      factory: (walker, namespace, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected as", walker);
        const [{ right }, done] = walker
          .expect("as", TokenTypeName.Operator)
          .extract("right", (w) => Type.Parse(w, namespace))
          .finish();

        return new ExpressionOperatorAs(_context(walker, done, namespace), existing, right);
      },
    });
  }

  readonly #left: Expression;
  readonly #right: Type;

  constructor(ctx: EntryContext, left: Expression, right: Type) {
    super(ctx);

    this.#left = left;
    this.#right = right;
  }

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx
      .with("left", (c) => this.#left.linked(left, c))
      .with("right", (c, { left }) => this.#right.linked(left.resolution, c))
      .finish(({ left, right }) => new LinkedExpressionOperatorAs(this.range, left, right));
  }
}
