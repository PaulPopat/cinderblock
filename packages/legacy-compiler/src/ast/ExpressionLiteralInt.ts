import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionLiteralInt extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /[0-9]+i?$/gm,
      factory: (walker, lookFor, existing) => {
        const [{ value }, done] = walker.text("value", TokenTypeName.Number).finish();
        return new ExpressionLiteralInt(_context(walker, done), value.replace("i", ""));
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
}
