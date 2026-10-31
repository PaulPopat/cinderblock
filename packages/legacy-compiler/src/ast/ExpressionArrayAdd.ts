import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionArrayAdd } from "#linked/LinkedExpressionArrayAdd";

export class ExpressionArrayAdd extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\+\+$/gm,
      factory: (walker, namespace, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected ++", walker);
        const [{ addition }, done] = walker
          .expect("++", TokenTypeName.Operator)
          .extract("addition", (w) => Expression.Parse(w, namespace, lookFor))
          .finish();

        return new ExpressionArrayAdd(_context(walker, done, namespace), existing, addition);
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

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx
      .with("subject", (c) => this.#subject.linked(left, c))
      .with("addition", (c, { subject }) => this.#addition.linked(subject, c))
      .finish(({ subject, addition }) => new LinkedExpressionArrayAdd(this.range, subject, addition));
  }
}
