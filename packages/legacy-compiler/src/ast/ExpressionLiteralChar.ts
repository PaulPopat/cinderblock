import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedExpression } from "#linked/LinkedExpression";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpressionLiteralChar } from "#linked/LinkedExpressionLiteralChar";

export class ExpressionLiteralChar extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^'([^']|\\.)'$/gm,
      factory: (walker, namespace, lookFor, existing) => {
        const [{ value }, done] = walker.text("value", TokenTypeName.String).finish();
        return new ExpressionLiteralChar(_context(walker, done, namespace), new Function("return " + value)());
      },
    });
  }

  readonly #value: string;

  constructor(ctx: EntryContext, value: string) {
    super(ctx);
    this.#value = value;
  }

  get value() {
    return this.#value;
  }

  linked(left: LinkedExpression | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpression] {
    return ctx.finish(() => new LinkedExpressionLiteralChar(this.range, this.#value));
  }
}
