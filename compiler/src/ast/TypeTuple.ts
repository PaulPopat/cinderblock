import { TypeArg } from "./TypeArg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Type } from "./Type.ts";

export class TypeTuple extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\($/gm,
      chainable: false,
      parse: (w) =>
        w
          .while(
            "parts",
            (s) => s.data === "(" || s.data === ",",
            TypeArg.Parse,
          )
          .finish(({ parts }, ctx) => new TypeTuple(ctx, parts)),
    });
  }

  readonly #args: Array<TypeArg>;

  constructor(ctx: EntryContext, args: Array<TypeArg>) {
    super(ctx);
    this.#args = args;
  }

  get args() {
    return this.#args;
  }
}
