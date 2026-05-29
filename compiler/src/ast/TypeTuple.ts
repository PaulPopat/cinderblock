import { Arg } from "./Arg.ts";
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
          .while("parts", (s) => s.data === "(" || s.data === ",", Arg.Parse)
          .finish(({ parts }, ctx) => new TypeTuple(ctx, parts)),
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
