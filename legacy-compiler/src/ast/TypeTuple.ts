import { TypeArg } from "./TypeArg.ts";
import { Type } from "./Type.ts";
import type { Entry } from "./Entry.ts";
import { Location } from "#utils";
import { TokenTypeName, TokenWalker } from "#tokeniser";
import type { Shape } from "#writer";

export class TypeTuple extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\{$/gm,
      chainable: false,
      factory: (walker: TokenWalker, parent: () => Entry | undefined, left?: Type) => {
        const [{ parts }, done] = walker
          .while(
            "parts",
            (s) => s.data === "{" || s.data === ",",
            (w) => TypeArg.Parse(w.expect(["{", ","], TokenTypeName.Punctuation), parent),
          )
          .expect("}", TokenTypeName.Punctuation)
          .finish();

        return new TypeTuple(walker.location, done, parent, parts);
      },
    });
  }

  static get empty() {
    return new TypeTuple(Location.empty, TokenWalker.empty, () => undefined, []);
  }

  readonly #args: Array<TypeArg>;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, args: Array<TypeArg>) {
    super(location, done, parent);
    this.#args = args;
  }

  get args() {
    return this.#args;
  }

  representation(depth: number): string {
    return `{ ${this.#args.map((a) => a.representation(depth + 1)).join(", ")} }`;
  }

  shape(): Shape {
    return {
      type: "tuple",
      args: this.args.map((a) => ({ key: a.name, value: a.type.shape() })),
    };
  }
}
