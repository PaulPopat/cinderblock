import type { Closure, Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { Type } from "./Type.ts";
import { TypeArg } from "./TypeArg.ts";
import { TokenTypeName } from "#tokeniser";
import { Entity } from "./Entity.ts";
import type { IEntityReferenceable } from "./IEntityReferenceable.ts";

export class EntityArg extends Entity implements IEntityReferenceable {
  readonly #type: Type;
  readonly #name: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined) {
    const [{ type, name }, done] = walker
      .text("name", TokenTypeName.ParameterName)
      .expect(":", TokenTypeName.Punctuation)
      .extract("type", (w) => Type.Parse(w, () => this))
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

  async reference(closure: Closure): Promise<Variable> {
    return closure.search(this.internalName, this.name, this.location);
  }

  get typeArg() {
    return new TypeArg(this.location, this.done, () => this, this.#type, this.#name);
  }

  dig(name: string): Entry | undefined {
    if (name === this.#name) return this;

    return undefined;
  }

  float(name: string): Entry | undefined {
    return this.parent?.float(name);
  }

  build(closure: Closure): Closure {
    return closure;
  }
}
