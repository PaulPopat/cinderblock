import { ContextManager } from "./ContextManager.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";

export class ExpressionReference extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^[a-zA-Z][a-zA-Z0-9_@$#:]*$/gm,
      parse: (w) =>
        w
          .text("value")
          .finish(({ value }, ctx) => new ExpressionReference(ctx, value)),
    });
  }

  readonly #name: string;
  readonly #manager: ContextManager;

  constructor(ctx: EntryContext, name: string) {
    super(ctx);
    this.#name = name;
    this.#manager = new ContextManager(ctx);
  }

  get name() {
    return this.#name;
  }

  get let() {
    return this.#manager.resolveLet(this.#name);
  }

  get resolution() {
    return this.let.type;
  }
}
