import { LinkedType } from "#linked/LinkedType";
import { LinkedTypeTuple } from "#linked/LinkedTypeTuple";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { EntityStruct } from "./EntityStruct.ts";
import { Entry } from "./Entry.ts";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypeArg } from "./TypeArg.ts";

export class TypeReference extends Type {
  static ParseReference(walker: TokenWalker, namespace: string) {
    const [{ value, args }, done] = walker
      .text("value", TokenTypeName.StructReference)
      .if(
        (s) => s.data === "(",
        (s) =>
          s
            .while(
              "args",
              (s) => (s.data === "," || s.data === "(") && s.expect([",", "("], TokenTypeName.Punctuation).data !== ")",
              (s) => TypeArg.Parse(s.expect([",", "("], TokenTypeName.Punctuation), namespace),
            )
            .expect(")", TokenTypeName.Punctuation),
      )
      .finish();

    return new TypeReference(_context(walker, done, namespace), value, args ?? []);
  }

  static {
    Type.RegisterType({
      priority: 1,
      match: /^[a-zA-Z][a-zA-Z0-9_@$#:]*$/gm,
      chainable: false,
      factory: TypeReference.ParseReference,
    });
  }

  readonly #name: string;
  readonly #args: Array<TypeArg>;

  constructor(ctx: EntryContext, name: string, args: Array<TypeArg>) {
    super(ctx);
    this.#name = name;
    this.#args = args;
  }

  get name() {
    return this.#name;
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext): [LinkerContext, LinkedType] {
    const found = [...this.namespaces, ""].reduce(
      (f, namespace) => f ?? ctx.search([namespace, this.#name].filter((a) => a).join("_"), this.range),
      undefined as unknown,
    );

    if (found instanceof LinkedType) {
      return ctx.finish(() => found);
    }

    if (found instanceof Entry) {
      if (found instanceof Type) {
        return found.linked(input, ctx);
      }

      if (!(found instanceof EntityStruct)) {
        throw new LinkerError("Expected a struct", this.range);
      }

      if (input && !(input instanceof LinkedTypeTuple)) {
        throw new LinkerError("Expected a tuple", input.range);
      }

      return found.linked(
        input,
        this.#args.reduce((found, arg) => found.searchable(arg.name, (found) => [found, arg.type]), ctx),
      );
    }

    throw new LinkerError("Reference not found", this.range);
  }
}
