import { Entity } from "./Entity.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";

export class EntityUse extends Entity {
  static {
    Expression.RegisterEntity({
      priority: 100,
      match: /^use$/gm,
      parse: (e) =>
        e
          .expect("use")
          .text("namespace")
          .finish(({ namespace }, ctx) => new EntityUse(ctx, namespace)),
    });
  }

  readonly #namespace: string;

  constructor(ctx: EntryContext, namespace: string) {
    super(ctx);
    this.#namespace = namespace;
  }

  get namespace() {
    return this.#namespace;
  }
}
