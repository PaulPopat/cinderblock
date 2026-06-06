import { TypeArg } from "./TypeArg.ts";
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
            (s) => TypeArg.Parse(s.next),
          )
          .expect(":")
          .extract("returns", (w) => Type.Parse(w))
          .finish(
            ({ args, returns }, ctx) => new TypePipeable(ctx, args, returns),
          ),
    });
  }

  readonly #args: Array<TypeArg>;
  readonly #returns: Type;

  constructor(ctx: EntryContext, args: Array<TypeArg>, returns: Type) {
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
