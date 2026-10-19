import { TypeArg } from "./TypeArg.ts";
import { Type } from "./Type.ts";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedType } from "#linked/LinkedType";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedTypePipeable } from "#linked/LinkedTypePipeable";
import { LinkerError } from "./LinkerError.ts";

export class TypePipeable extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^\($/gm,
      chainable: false,
      factory: (walker: TokenWalker, left?: Type) => {
        const [{ args, returns }, done] = walker
          .while(
            "args",
            (s) => (s.data === "," || s.data === "(") && s.expect([",", "("], TokenTypeName.Punctuation).data !== ")",
            (s) => TypeArg.Parse(s.expect([",", "("], TokenTypeName.Punctuation)),
          )
          .if(
            (s) => s.data === "(",
            (s) => s.expect("(", TokenTypeName.Punctuation),
          )
          .expect(")", TokenTypeName.Punctuation)
          .expect(":", TokenTypeName.Punctuation)
          .extract("returns", (w) => Type.Parse(w))
          .finish();

        return new TypePipeable(_context(walker, done), args, returns);
      },
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

  linked(input: LinkedType | undefined, ctx: LinkerContext) {
    if (input && !(input instanceof LinkedTypePipeable)) {
      throw new LinkerError("Invalid type", input.range);
    }

    return ctx
      .mapWith(this.#args, "args", (c, arg) =>
        arg.linked(
          input?.args.find((b) => b.name === arg.name),
          c,
        ),
      )
      .with("returns", (c) => this.#returns.linked(input?.returns, c))
      .finish(({ args, returns }) => new LinkedTypePipeable(this.range, args, returns));
  }
}
