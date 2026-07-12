import { Entity } from "./Entity.ts";
import type { EntryContext } from "./EntryContext.ts";
import { TokenWalker } from "./TokenWalker.ts";
import { Type } from "./Type.ts";
import { TypeArg } from "./TypeArg.ts";

export class EntityArg extends Entity {
  static Parse(walker: TokenWalker) {
    return walker
      .text("name")
      .expect(":")
      .extract("type", (w) => Type.Parse(w))
      .finish(({ type, name }, ctx) => new EntityArg(ctx, type, name));
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

  get fullName() {
    return this.#name;
  }

  get typeArg() {
    return new TypeArg(this.ctx, this.#type, this.#name);
  }
}
