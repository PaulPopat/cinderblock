import { EntityLet } from "./EntityLet.ts";
import { EntityStruct } from "./EntityStruct.ts";
import { EntityUse } from "./EntityUse.ts";
import type { EntryContext } from "./EntryContext.ts";
import { LinkerError } from "./LinkerError.ts";

export class ContextManager {
  readonly #ctx: EntryContext;

  constructor(ctx: EntryContext) {
    this.#ctx = ctx;
  }

  resolveStruct(name: string) {
    const possible = [
      [this.#ctx.namespace, name].join(":"),
      ...this.#ctx.entities
        .filter((e) => e instanceof EntityUse)
        .map((e) => [e.namespace, name].join(":")),
    ];

    const found = this.#ctx.entities
      .filter((e) => e instanceof EntityStruct)
      .filter((s) => possible.includes(s.fullName));

    if (found.length > 1)
      throw new LinkerError("Ambigious struct reference", this.#ctx.start);

    const [result] = found;
    if (!result) throw new LinkerError("Struct not found", this.#ctx.start);

    return result;
  }

  resolveLet(name: string) {
    const possible = [
      [this.#ctx.namespace, name].join(":"),
      ...this.#ctx.entities
        .filter((e) => e instanceof EntityUse)
        .map((e) => [e.namespace, name].join(":")),
    ];

    const found = this.#ctx.entities
      .filter((e) => e instanceof EntityLet)
      .filter((s) => possible.includes(s.fullName));

    if (found.length > 1)
      throw new LinkerError("Ambigious let reference", this.#ctx.start);

    const [result] = found;
    if (!result) throw new LinkerError("Let not found", this.#ctx.start);

    return result;
  }
}
