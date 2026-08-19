import { Entity } from "./Entity.ts";
import type { Entry } from "./Entry.ts";
import { TokenWalker } from "./TokenWalker.ts";
import { Type } from "./Type.ts";
import { TypeArg } from "./TypeArg.ts";

export class EntityArg extends Entity {
  readonly #type: Type;
  readonly #name: string;

  constructor(walker: TokenWalker, parent: Entry | undefined) {
    const [{ type, name }, done] = walker
      .text("name")
      .expect(":")
      .extract("type", (w) => Type.Parse(w, this))
      .finish();
    super(walker.location, done, parent);
    this.#type = type;
    this.#name = name.startsWith('"') ? JSON.parse(name) : name;
  }

  get type() {
    return this.#type;
  }

  get name() {
    return this.#name;
  }

  get internalName() {
    return this.#name;
  }

  get fullName() {
    return this.#name;
  }

  get typeArg() {
    return new TypeArg(this.location, this.done, this, this.#type, this.#name);
  }
}
