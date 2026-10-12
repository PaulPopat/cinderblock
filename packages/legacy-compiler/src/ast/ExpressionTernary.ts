import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionTernary extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^\?$/gm,
      factory: (walker, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected ?", walker);
        const [{ positive, negative }, done] = walker
          .expect("?", TokenTypeName.Operator)
          .extract("positive", (w) => Expression.Parse(w, [":"]))
          .extract("negative", (w) => Expression.Parse(w, lookFor))
          .finish();

        return new ExpressionTernary(_context(walker, done), existing, positive, negative);
      },
    });
  }

  readonly #predicate: Expression;
  readonly #positive: Expression;
  readonly #negative: Expression;

  constructor(ctx: EntryContext, predicate: Expression, positive: Expression, negative: Expression) {
    super(ctx);
    this.#predicate = predicate;
    this.#positive = positive;
    this.#negative = negative;
  }

  get predicate() {
    return this.#predicate;
  }

  get positive() {
    return this.#positive;
  }

  get negative() {
    return this.#negative;
  }
}
