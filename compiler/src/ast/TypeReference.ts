import { ContextManager } from "./ContextManager.ts";
import type { EntityStruct } from "./EntityStruct.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Type } from "./Type.ts";
import { TypeTuple } from "./TypeTuple.ts";

export class TypeReference extends TypeTuple {
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
  readonly #struct: EntityStruct;

  constructor(ctx: EntryContext, name: string) {
    const manager = new ContextManager(ctx);
    const struct = manager.resolveStruct(name);
    super(ctx, struct.args);
    this.#name = name;
    this.#struct = struct;
  }

  get name() {
    return this.#name;
  }

  get struct() {
    return this.#struct;
  }
}
