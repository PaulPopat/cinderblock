import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { Type } from "./Type.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionOperatorAs extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^as$/gm,
      factory: (walker, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected as", walker);
        const [{ right }, done] = walker
          .expect("as", TokenTypeName.Operator)
          .extract("right", (w) => Type.Parse(w))
          .finish();

        return new ExpressionOperatorAs(_context(walker, done), existing, right);
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
}
