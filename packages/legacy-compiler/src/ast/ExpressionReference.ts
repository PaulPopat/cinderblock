import { Expression } from "./Expression.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";

export class ExpressionReference extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^[a-zA-Z_@$#:][a-zA-Z0-9_@$#:]*$/gm,
      factory: (walker, lookFor, existing) => {
        const [{ value }, done] = walker.text("value", TokenTypeName.VariableName).finish();
        return new ExpressionReference(_context(walker, done), value);
      },
    });
  }

  readonly #name: string;

  constructor(ctx: EntryContext, name: string) {
    super(ctx);
    this.#name = name;
  }

  get name() {
    return this.#name;
  }
}
