import { TypeArg } from "./TypeArg.ts";
import { Entity } from "./Entity.ts";
import { TokenTypeName } from "#tokeniser";
import { TypeReference } from "./TypeReference.ts";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { LinkedTypeTuple } from "#linked/LinkedTypeTuple";

export class EntityStruct extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^struct$/gm,
      factory: (walker) => {
        const [{ name, args, extending, expecting }, done] = walker
          .expect("struct", TokenTypeName.KeyWord)
          .text("name", TokenTypeName.StructName)
          .if(
            (s) => s.data === "(",
            (s) =>
              s
                .while(
                  "expecting",
                  (s) => (s.data === "," || s.data === "(") && s.expect([",", "("], TokenTypeName.Punctuation).data !== ")",
                  (s) => TypeArg.Parse(s.expect([",", "("], TokenTypeName.Punctuation)),
                )
                .expect(")", TokenTypeName.Punctuation),
          )
          .if(
            (s) => s.data === ":",
            (w) =>
              w.while(
                "extending",
                (s) => s.data === ":" || s.data === ",",
                (s) => TypeReference.ParseReference(s.expect([":", ","], TokenTypeName.Operator)),
              ),
          )
          .while(
            "args",
            (s) => s.data !== ";",
            (s) => TypeArg.Parse(s),
          )
          .expect(";", TokenTypeName.Punctuation)
          .finish();

        return new EntityStruct(_context(walker, done), name, extending ?? [], expecting ?? [], args);
      },
    });
  }

  readonly #name: string;
  readonly #extending: Array<TypeReference>;
  readonly #expecting: Array<TypeArg>;
  readonly #args: Array<TypeArg>;

  constructor(ctx: EntryContext, name: string, extending: Array<TypeReference>, expecting: Array<TypeArg>, args: Array<TypeArg>) {
    super(ctx);
    this.#name = name;
    this.#extending = extending;
    this.#expecting = expecting;
    this.#args = args;
  }

  get name() {
    return this.#name;
  }

  build(ctx: LinkerContext, input: LinkedTypeTuple | undefined) {
    if (input) {
      for (const expecting of this.#expecting) {
        const arg = input.args.find((a) => a.name === expecting.name);
        if (!arg) {
          throw new LinkerError("Could not find arg", input.range);
        }

        ctx = ctx.searchable(expecting.name, (c) => expecting.linked(arg, c));
      }
    }

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
