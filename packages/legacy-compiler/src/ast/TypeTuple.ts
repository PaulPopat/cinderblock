import { TypeArg } from "./TypeArg.ts";
import { Type } from "./Type.ts";
import { TokenTypeName, TokenWalker } from "#tokeniser";
import { TypeReference } from "./TypeReference.ts";
import { _context, _empty, type EntryContext } from "./EntryContext.ts";
import type { LinkedType } from "#linked/LinkedType";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedTypeTuple } from "#linked/LinkedTypeTuple";
import { LinkerError } from "./LinkerError.ts";

export class TypeTuple extends Type {
  static {
    Type.RegisterType({
      priority: 100,
      match: /^struct$/gm,
      chainable: false,
      factory: (walker: TokenWalker, namespace, left?: Type) => {
        const [{ parts, extending }, done] = walker
          .expect("struct", TokenTypeName.KeyWord)
          .if(
            (s) => s.data === ":",
            (w) =>
              w.while(
                "extending",
                (s) => s.data === ":" || s.data === ",",
                (s) => TypeReference.ParseReference(s.expect([":", ","], TokenTypeName.Operator), namespace),
              ),
          )
          .while(
            "parts",
            (s) => s.data !== ";",
            (s) => TypeArg.Parse(s, namespace),
          )
          .expect(";", TokenTypeName.Punctuation)
          .finish();

        return new TypeTuple(_context(walker, done, namespace), parts, extending ?? []);
      },
    });
  }

  static get empty() {
    return new TypeTuple(_empty(), [], []);
  }

  readonly #args: Array<TypeArg>;
  readonly #extending: Array<TypeReference>;

  constructor(ctx: EntryContext, args: Array<TypeArg>, extending: Array<TypeReference> = []) {
    super(ctx);
    this.#args = args;
    this.#extending = extending;
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    return ctx
      .mapWith(this.#extending, "extending", (c, i) => i.linked(undefined, c))
      .mapWith(this.#args, "args", (c, i) => i.linked(undefined, c))
      .finish(({ extending, args }) => {
        return new LinkedTypeTuple(this.range, [
          ...extending.flatMap((e) => {
            if (e instanceof LinkedTypeTuple) {
              return e.args;
            }

            throw new LinkerError("Expected a tuple", this.range);
          }),
          ...args,
        ]);
      });
  }
}
