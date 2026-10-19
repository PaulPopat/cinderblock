import { LinkedType } from "#linked/LinkedType";
import { LinkedTypeTuple } from "#linked/LinkedTypeTuple";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { BoundEntry } from "./BoundEntry.ts";
import { EntityStruct } from "./EntityStruct.ts";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";
import { TypeArg } from "./TypeArg.ts";

export class TypeReference extends Type {
  static ParseReference(walker: TokenWalker) {
    const [{ value, args }, done] = walker
      .text("value", TokenTypeName.StructReference)
      .if(
        (s) => s.data === "(",
        (s) =>
          s
            .while(
              "args",
              (s) => (s.data === "," || s.data === "(") && s.expect([",", "("], TokenTypeName.Punctuation).data !== ")",
              (s) => TypeArg.Parse(s.expect([",", "("], TokenTypeName.Punctuation)),
            )
            .expect(")", TokenTypeName.Punctuation),
      )
      .finish();

    return new TypeReference(_context(walker, done), value, args ?? []);
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
    const found = ctx.search(this.#name, this.range);
    if (found instanceof LinkedType) {
      return ctx.finish(() => found);
    }

    if (found instanceof BoundEntry) {
      if (found.is(Type)) {
        const [, result] = found.subject.linked(input, found.context);

        return ctx.finish(() => result);
      }

      if (!found.is(EntityStruct)) {
        throw new LinkerError("Expected a struct", this.range);
      }

      if (input && !(input instanceof LinkedTypeTuple)) {
        throw new LinkerError("Expected a tuple", input.range);
      }

      const inputCtx = this.#args.reduce(
        (found, arg) => found.searchable(arg.name, (found) => [found, new BoundEntry(ctx, arg.type)]),
        found.context,
      );
      const [, result] = found.subject.linked(input, inputCtx);

      return ctx.finish(() => result);
    }

    throw new LinkerError("Reference not found", this.range);
  }
}
