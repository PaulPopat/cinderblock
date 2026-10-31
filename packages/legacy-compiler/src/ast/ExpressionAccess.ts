import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionAccess } from "#linked/LinkedExpressionAccess";

export class ExpressionAccess extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\.$/gm,
      inOne: true,
      factory: (walker, namespace, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected .", walker);

        const [{ name }, done] = walker.expect(".", TokenTypeName.Operator).text("name", TokenTypeName.PropertyReference).finish();

        return new ExpressionAccess(_context(walker, done, namespace), existing, name);
      },
    });
  }

  readonly #subject: Expression;
  readonly #name: string;

  constructor(ctx: EntryContext, subject: Expression, name: string) {
    super(ctx);
    this.#subject = subject;
    this.#name = name;
  }

  get subject() {
    return this.#subject;
  }

  get name() {
    return this.#name;
  }

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx
      .with("subject", (c) => this.#subject.linked(left, c))
      .finish(({ subject }) => new LinkedExpressionAccess(this.range, subject, this.#name));
  }
}
