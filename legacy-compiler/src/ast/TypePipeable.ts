import { TypeArg } from "./TypeArg.ts";
import { Type } from "./Type.ts";
import type { Entry } from "./Entry.ts";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Shape } from "#writer";

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
            (s) => (s.data === "," || s.data === "(") && s.expect([",", "("], TokenTypeName.Punctuation).data !== ")",
            (s) => TypeArg.Parse(s.expect([",", "("], TokenTypeName.Punctuation), parent),
          )
          .if(
            (s) => s.data === "(",
            (s) => s.expect("(", TokenTypeName.Punctuation),
          )
          .expect(")", TokenTypeName.Punctuation)
          .expect(":", TokenTypeName.Punctuation)
          .extract("returns", (w) => Type.Parse(w, parent))
          .finish();

        return new TypePipeable(walker.location, done, parent, args, returns);
      },
    });
  }

  readonly #args: Array<TypeArg>;
  readonly #returns: Type;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, args: Array<TypeArg>, returns: Type) {
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

  get flattened() {
    return new TypePipeable(
      this.location,
      this.done,
      () => this.parent,
      this.#args.map((a) => a.flattened),
      this.#returns.flattened,
    );
  }

  matches(input: Type): boolean {
    return (
      input instanceof TypePipeable &&
      input.args.length === this.args.length &&
      !input.#args.some((a) => !this.#args.some((b) => a.matches(b))) &&
      input.returns.flattened.matches(this.#returns.flattened)
    );
  }

  representation(depth: number): string {
    return `(${this.#args.map((a) => a.representation(depth + 1)).join(", ")}): ${this.#returns.representation(depth + 1)}`;
  }

  shape(): Shape {
    return { type: "pipeable" };
  }
}
