import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionIndex } from "#linked/LinkedExpressionIndex";

export class ExpressionIndex extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^@$/gm,
      inOne: true,
      factory: (walker, namespace, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected @", walker);

        const [{ key }, done] = walker
          .expect("@", TokenTypeName.Operator)
          .extract("key", (w) => Expression.ParseOne(w, namespace))
          .finish();

        return new ExpressionIndex(_context(walker, done, namespace), existing, key);
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

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx
      .with("subject", (c) => this.#subject.linked(left, c))
      .with("key", (c, { subject }) => this.#key.linked(subject, c))
      .finish(({ subject, key }) => new LinkedExpressionIndex(this.range, subject, key));
  }
}
