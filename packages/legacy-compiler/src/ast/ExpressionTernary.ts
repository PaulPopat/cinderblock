import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionTernary } from "#linked/LinkedExpressionTernary";

export class ExpressionTernary extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^\?$/gm,
      factory: (walker, namespace, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected ?", walker);
        const [{ positive, negative }, done] = walker
          .expect("?", TokenTypeName.Operator)
          .extract("positive", (w) => Expression.Parse(w, namespace, [":"]))
          .extract("negative", (w) => Expression.Parse(w, namespace, lookFor))
          .finish();

        return new ExpressionTernary(_context(walker, done, namespace), existing, positive, negative);
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

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx
      .with("predicate", (c) => this.#predicate.linked(left, c))
      .with("positive", (c, { predicate }) => this.#positive.linked(predicate, c))
      .with("negative", (c, { positive }) => this.#negative.linked(positive, c))
      .finish(({ predicate, positive, negative }) => new LinkedExpressionTernary(this.range, predicate, positive, negative));
  }
}
