import { Arg } from "./Arg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Type } from "./Type.ts";

export class TypePipeable extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\($/gm,
      chainable: false,
      parse: (w) =>
        w
          .expect("(")
          .while(
            "args",
            (s) => s.data === "," || s.data === "(",
            (s) => Arg.Parse(s.next),
          )
          .expect(":")
          .extract("returns", (w) => Type.Parse(w))
          .finish(
            ({ args, returns }, ctx) => new TypePipeable(ctx, args, returns),
          ),
    });
  }

  readonly #args: Array<Arg>;
  readonly #returns: Type;

  constructor(ctx: EntryContext, args: Array<Arg>, returns: Type) {
    super(ctx);
    this.#args = args;
    this.#returns = returns;
  }

  get args() {
    return this.#args;
  }

  get returns() {
    return this.#returns;
  }
}
