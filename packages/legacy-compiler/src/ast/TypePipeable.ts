import { TypeArg } from "./TypeArg.ts";
import { Type } from "./Type.ts";
import type { Entry } from "./Entry.ts";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import type { Location } from "#utils";
import type { Shape } from "#writer";
import { LinkerError } from "./LinkerError.ts";

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
            (s) => TypeArg.Parse(s.expect([",", "("], TokenTypeName.Punctuation), (): Entry => result),
          )
          .if(
            (s) => s.data === "(",
            (s) => s.expect("(", TokenTypeName.Punctuation),
          )
          .expect(")", TokenTypeName.Punctuation)
          .expect(":", TokenTypeName.Punctuation)
          .extract("returns", (w) => Type.Parse(w, (): Entry => result))
          .finish();

        const result = new TypePipeable(walker.location, done, parent, args, returns);
        return result;
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

  flattened(): TypePipeable {
    return new TypePipeable(
      this.location,
      this.done,
      () => this.parent,
      this.#args.map((a) => a.flattened()),
      this.#returns.flattened(),
    );
  }

  matches(input: Type): boolean {
    return (
      input instanceof TypePipeable &&
      input.args.length === this.args.length &&
      !input.#args.some((a) => !this.#args.some((b) => a.matches(b))) &&
      input.returns.matches(this.#returns)
    );
  }

  representation(depth: number): string {
    return `(${this.#args.map((a) => a.representation(depth + 1)).join(", ")}): ${this.#returns.representation(depth + 1)}`;
  }

  shape(): Shape {
    return { type: "pipeable" };
  }

  compatible(input: Type): input is TypePipeable {
    return (
      input instanceof TypePipeable &&
      input.args.length === this.args.length &&
      !input.#args.some((a) => !this.#args.some((b) => a.compatible(b))) &&
      input.returns.compatible(this.#returns)
    );
  }

  dig(name: string): Entry | undefined {
    return this.#args.find((a) => a.dig(name)) ?? this.#returns.dig(name);
  }

  float(name: string): Entry | undefined {
    return this.dig(name) ?? this.parent?.float(name);
  }

  consolidate(input: Type, parent: () => Entry | undefined): Type {
    if (!(input instanceof TypePipeable)) {
      throw new LinkerError("Invalid type", input.range);
    }

    const result = new TypePipeable(
      this.location,
      this.done,
      parent,
      this.#args.map((a) => input.args.find((b) => a.name === b.name)?.consolidate(a, (): Entry => result) ?? a),
      this.#returns.consolidate(input.returns, (): Entry => result),
    );

    return result;
  }
}
