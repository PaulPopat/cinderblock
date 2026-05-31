import { Arg } from "./Arg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ExpressionCaseStatement } from "./ExpressionCaseStatement.ts";
import { ParserError } from "./ParserError.ts";

export class ExpressionCase extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^~$/gm,
      parse: (w, predicate) => {
        if (!predicate) throw new ParserError("Unexpected ~", w.store);
        return w
          .expect("~")
          .while(
            "patterns",
            (s) => s.data === ",",
            (w) =>
              w
                .expect("(")
                .extract("arg", (w) => Arg.Parse(w))
                .expect(")")
                .extract("statement", (w) => Expression.Parse(w))
                .finish(
                  ({ arg, statement }, ctx) =>
                    new ExpressionCaseStatement(ctx, arg, statement),
                ),
          )
          .finish(({ patterns }, ctx) => new ExpressionCase(ctx, patterns));
      },
    });
  }

  readonly #patterns: Array<ExpressionCaseStatement>;

  constructor(ctx: EntryContext, patterns: Array<ExpressionCaseStatement>) {
    super(ctx);
    this.#patterns = patterns;
  }

  get patterns() {
    return this.#patterns;
  }
}
