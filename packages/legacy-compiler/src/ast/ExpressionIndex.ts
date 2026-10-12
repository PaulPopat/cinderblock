import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionIndex extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^@$/gm,
      inOne: true,
      factory: (walker, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected @", walker);

        const [{ key }, done] = walker
          .expect("@", TokenTypeName.Operator)
          .extract("key", (w) => Expression.ParseOne(w))
          .finish();

        return new ExpressionIndex(_context(walker, done), existing, key);
      },
    });
  }

  readonly #subject: Expression;
  readonly #key: Expression;

  constructor(ctx: EntryContext, subject: Expression, key: Expression) {
    super(ctx);
    this.#subject = subject;
    this.#key = key;
  }
}
