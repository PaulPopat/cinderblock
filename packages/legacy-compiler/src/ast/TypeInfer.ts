import type { LinkedType } from "#linked/LinkedType";
import { TokenTypeName, type TokenWalker } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";

export class TypeInfer extends Type {
  static ParseInfer(walker: TokenWalker, namespace: string, left?: Type) {
    const [{ value }, done] = walker.expect("infer", TokenTypeName.KeyWord).text("value", TokenTypeName.StructReference).finish();

    return new TypeInfer(_context(walker, done, namespace), value);
  }

  static {
    Type.RegisterType({
      priority: 2,
      match: /^infer$/gm,
      chainable: false,
      factory: TypeInfer.ParseInfer,
    });
  }

  readonly #name: string;

  constructor(ctx: EntryContext, name: string) {
    super(ctx);
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  linked(input: LinkedType | undefined, ctx: LinkerContext) {
    if (!input) {
      throw new LinkerError("Invalid infer", this.range);
    }

    return ctx.searchable(this.#name, (c) => [c, input]).finish(() => input);
  }
}
