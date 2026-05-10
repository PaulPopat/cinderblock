import { Arg } from "./Arg.ts";
import { Entity } from "./Entity.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";

export class EntityStruct extends Entity {
  static {
    Expression.RegisterEntity({
      priority: 100,
      match: /^struct$/gm,
      parse: (e) =>
        e
          .expect("struct")
          .text("name")
          .expect("(")
          .while(
            "args",
            (s) => s.data === ",",
            (s) => Arg.Parse(s.next),
          )
          .expect(")")
          .finish(({ args }, ctx) => new EntityStruct(ctx, args)),
    });
  }

  readonly #args: Array<Arg>;

  constructor(ctx: EntryContext, args: Array<Arg>) {
    super(ctx);
    this.#args = args;
  }

  get args() {
    return this.#args;
  }
}
