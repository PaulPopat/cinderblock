import { Entity } from "./Entity.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { TokenWalker } from "./TokenWalker.ts";

export class EntitySide extends Entity {
  static {
    Expression.RegisterEntity({
      priority: 100,
      match: /^side$/gm,
      parse: (w) =>
        w
          .expect("side")
          .extract("block", (s) => Expression.Parse(s))
          .finish(({ block }, ctx) => new EntitySide(ctx, block)),
    });
  }

  readonly #result: Expression;

  constructor(ctx: EntryContext, result: Expression) {
    super(ctx);
    this.#result = result;
  }

  get result() {
    return this.#result;
  }
}
