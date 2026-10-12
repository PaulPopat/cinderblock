import { Expression } from "./Expression.ts";
import { TokenTypeName } from "#tokeniser";
import { ParserError } from "./ParserError.ts";
import { ExpressionLet } from "./ExpressionLet.ts";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionMatch extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\|$/gm,
      factory: (walker, lookFor, existing) => {
        if (!existing) {
          throw new ParserError("Unexpected |", walker);
        }

        const [{ matchers }, done] = walker
          .expect("|", TokenTypeName.Punctuation)
          .while(
            "matchers",
            (w) => w.nextIs("let"),
            (s) => ExpressionLet.Parse(s.expect([...lookFor, ","], TokenTypeName.Punctuation), [...lookFor, ","]),
          )
          .finish();

        return new ExpressionMatch(_context(walker, done), existing, matchers);
      },
    });
  }

  readonly #subject: Expression;
  readonly #matchers: Array<ExpressionLet>;

  constructor(ctx: EntryContext, subject: Expression, matchers: Array<ExpressionLet>) {
    super(ctx);
    this.#subject = subject;
    this.#matchers = matchers;
  }
}
