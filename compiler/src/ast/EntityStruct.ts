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
          .finish(({ name, args }, ctx) => new EntityStruct(ctx, name, args)),
    });
  }

  readonly #name: string;
  readonly #args: Array<Arg>;

  constructor(ctx: EntryContext, name: string, args: Array<Arg>) {
    super(ctx);
    this.#name = name;
    this.#args = args;
  }

  get name() {
    return this.#name;
  }

  get args() {
    return this.#args;
  }

  get fullName() {
    return [this.ctx.namespace, this.#name].join(":");
  }
}
