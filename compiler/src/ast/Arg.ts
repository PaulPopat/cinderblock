import { Entry } from "./Entry.ts";
import type { EntryContext } from "./EntryContext.ts";
import { TokenWalker } from "./TokenWalker.ts";
import { Type } from "./Type.ts";

export class Arg extends Entry {
  static Parse(walker: TokenWalker) {
    return walker
      .extract("type", (w) => Type.Parse(w))
      .text("name")
      .finish(({ type, name }, ctx) => new Arg(ctx, type, name));
  }

  readonly #type: Type;
  readonly #name: string;

  constructor(ctx: EntryContext, type: Type, name: string) {
    super(ctx);
    this.#type = type;
    this.#name = name;
  }

  get type() {
    return this.#type;
  }

  get name() {
    return this.#name;
  }
}
