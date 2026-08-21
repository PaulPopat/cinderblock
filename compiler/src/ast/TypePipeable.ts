import { TypeArg } from "./TypeArg.ts";
import { Type } from "./Type.ts";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import type { TokenStore } from "#tokeniser";
import type { Location } from "#utils";

export class TypePipeable extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\($/gm,
      chainable: false,
      factory: (walker: TokenWalker, parent: () => Entry | undefined, left?: Type) => {
        const [{ args, returns }, done] = walker
          .while(
            "args",
            (s) => s.data === "," || s.data === "(",
            (s) => TypeArg.Parse(s.next, parent),
          )
          .expect(")")
          .expect(":")
          .extract("returns", (w) => Type.Parse(w, parent))
          .finish();

        return new TypePipeable(walker.location, done, parent, args, returns);
      },
    });
  }

  readonly #args: Array<TypeArg>;
  readonly #returns: Type;

  constructor(location: Location, done: TokenStore, parent: () => Entry | undefined, args: Array<TypeArg>, returns: Type) {
    super(location, done, parent);
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
