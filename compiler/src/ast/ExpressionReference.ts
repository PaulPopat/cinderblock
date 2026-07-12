import { Instructions } from "#binary";
import { Names } from "#utils";
import { ContextManager } from "./ContextManager.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { TypeArg } from "./TypeArg.ts";
import { TypePipeable } from "./TypePipeable.ts";

export class ExpressionReference extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 1,
      match: /^[a-zA-Z_@$#:][a-zA-Z0-9_@$#:]*$/gm,
      parse: (w) => w.text("value").finish(({ value }, ctx) => new ExpressionReference(ctx, value)),
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

  get subject() {
    return this.#manager.resolveConcrete(this.#name);
  }

  get resolution() {
    return this.subject.type;
  }

  get instructions() {
    if (this.resolution instanceof TypeArg) {
      return [Instructions.SearchClosures(Names.PropertyName(this.#name), this.id)];
    }

    if (this.resolution instanceof TypePipeable) {
      
    }

    return [];
  }
}
