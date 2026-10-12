import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionArrayAdd extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\+\+$/gm,
      factory: (walker, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected ++", walker);
        const [{ addition }, done] = walker
          .expect("++", TokenTypeName.Operator)
          .extract("addition", (w) => Expression.Parse(w, lookFor))
          .finish();

        return new ExpressionArrayAdd(_context(walker, done), existing, addition);
      },
    });
  }

  readonly #subject: Expression;
  readonly #addition: Expression;

  constructor(ctx: EntryContext, subject: Expression, addition: Expression) {
    super(ctx);
    this.#subject = subject;
    this.#addition = addition;
  }

  get subject() {
    return this.#subject;
  }

  get addition() {
    return this.#addition;
  }
}
