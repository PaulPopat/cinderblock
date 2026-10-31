import { Expression } from "./Expression.ts";
import { TokenTypeName } from "#tokeniser";
import { ParserError } from "./ParserError.ts";
import { ExpressionLet } from "./ExpressionLet.ts";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionMatch } from "#linked/LinkedExpressionMatch";

export class ExpressionMatch extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\|$/gm,
      factory: (walker, namespace, lookFor, existing) => {
        if (!existing) {
          throw new ParserError("Unexpected |", walker);
        }

        const [{ matchers }, done] = walker
          .while(
            "matchers",
            (w) => w.nextIs("let"),
            (s) => ExpressionLet.Parse(s.expect([...lookFor, "|", ","], TokenTypeName.Punctuation), namespace, [...lookFor, ","]),
          )
          .finish();

        return new ExpressionMatch(_context(walker, done, namespace), existing, matchers);
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

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx
      .with("subject", (c) => this.#subject.linked(left, c))
      .mapWith(this.#matchers, "matchers", (c, m) => m.linked(undefined, c))
      .finish(({ subject, matchers }) => new LinkedExpressionMatch(this.range, subject, matchers));
  }
}
