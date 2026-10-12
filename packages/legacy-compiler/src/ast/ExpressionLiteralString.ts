import { Expression } from "./Expression.ts";
import { ExpressionLiteral } from "./ExpressionLiteral.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionLiteralString extends ExpressionLiteral {
  static {
    Expression.RegisterExpression({
      priority: 150,
      match: /^("([^"]|\\.)+"|"")$/gm,
      factory: (walker, lookFor, existing) => {
        const [{ value }, done] = walker.text("value", TokenTypeName.String).finish();
        return new ExpressionLiteralString(_context(walker, done), new Function("return " + value)());
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
