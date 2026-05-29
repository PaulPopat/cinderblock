import type { EntryContext } from "./EntryContext.ts";
import { Type } from "./Type.ts";

export class TypeReference extends Type {
  static {
    Type.RegisterType({
      priority: 1,
      match: /^[a-zA-Z][a-zA-Z0-9_@$#:]*$/gm,
      chainable: false,
      parse: (w) =>
        w
          .text("value")
          .finish(({ value }, ctx) => new TypeReference(ctx, value)),
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
}
