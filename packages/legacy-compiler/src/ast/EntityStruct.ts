import { TypeArg } from "./TypeArg.ts";
import { Entity } from "./Entity.ts";
import { TokenTypeName } from "#tokeniser";
import { TypeReference } from "./TypeReference.ts";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { LinkedTypeTuple } from "#linked/LinkedTypeTuple";
import type { LinkedEntry } from "#linked/LinkedEntry";

export class EntityStruct extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^struct$/gm,
      factory: (walker, namespace) => {
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
                  (s, _, { name }) => TypeArg.Parse(s.expect([",", "("], TokenTypeName.Punctuation), [namespace, name].filter((c) => c).join("_")),
                )
                .expect(")", TokenTypeName.Punctuation),
          )
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
            "args",
            (s) => s.data !== ";",
            (s, _, { name }) => TypeArg.Parse(s, [namespace, name].filter((c) => c).join("_")),
          )
          .expect(";", TokenTypeName.Punctuation)
          .finish();

        return new EntityStruct(_context(walker, done, namespace), namespace, name, extending ?? [], expecting ?? [], args);
      },
    });
  }

  readonly #name: string;
  readonly #extending: Array<TypeReference>;
  readonly #expecting: Array<TypeArg>;
  readonly #args: Array<TypeArg>;

  constructor(ctx: EntryContext, namespace: string, name: string, extending: Array<TypeReference>, expecting: Array<TypeArg>, args: Array<TypeArg>) {
    super(ctx);
    this.#name = [namespace, name].filter((c) => c).join("_");
    this.#extending = extending;
    this.#expecting = expecting;
    this.#args = args;
  }

  get name() {
    return this.#name;
  }

  get extending() {
    return this.#extending;
  }

  get args() {
    return this.#args;
  }

  linked(input: LinkedEntry | undefined, ctx: LinkerContext) {
    if (input && !(input instanceof LinkedTypeTuple)) {
      throw new LinkerError("Invalid input", this.range);
    }

    return ctx
      .mapWith(this.#extending, "extending", (c, i) => i.linked(input, c))
      .mapWith(this.#args, "args", (c, i) =>
        i.linked(
          input?.args.find((a) => a.name === i.name),
          c,
        ),
      )
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

  search(name: string): Array<Entity> {
    return name === this.name ? [this] : [];
  }
}
