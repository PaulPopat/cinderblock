import { TypeArg } from "./TypeArg.ts";
import { Type } from "./Type.ts";
import type { Entry } from "./Entry.ts";
import { Location } from "#utils";
import { TokenTypeName, TokenWalker } from "#tokeniser";
import type { Shape } from "#writer";
import { TypeReference } from "./TypeReference.ts";

export class TypeTuple extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^struct$/gm,
      chainable: false,
      factory: (walker: TokenWalker, parent: () => Entry | undefined, left?: Type) => {
        const [{ parts, extending }, done] = walker
          .if(
            (s) => s.data === ":",
            (w) =>
              w.while(
                "extending",
                (s) => s.data === ":" || s.data === ",",
                (s) => TypeReference.ParseReference(s.expect([":", ","], TokenTypeName.Operator), (): Entry => result),
              ),
          )
          .while(
            "parts",
            (s) => s.data !== ";",
            (s) => TypeArg.Parse(s, (): Entry => result),
          )
          .expect(";", TokenTypeName.Punctuation)
          .finish();

        const result = new TypeTuple(walker.location, done, parent, parts, extending ?? []);
        return result;
      },
    });
  }

  static get empty() {
    return new TypeTuple(Location.empty, TokenWalker.empty, () => undefined, [], []);
  }

  readonly #args: Array<TypeArg>;
  readonly #extending: Array<TypeReference>;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, args: Array<TypeArg>, extending: Array<TypeReference> = []) {
    super(location, done, parent);
    this.#args = args;
    this.#extending = extending;
  }

  get args() {
    return [...this.#args, ...this.#extending.flatMap((e) => e.struct.args)];
  }

  flattened(generics: Record<string, Type>): Type {
    return new TypeTuple(
      this.location,
      this.done,
      () => this.parent,
      this.args.map((a) => a.flattened(generics)),
    );
  }

  matches(input: Type): boolean {
    return input instanceof TypeTuple && !input.args.some((a) => !this.args.some((b) => a.matches(b)));
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
