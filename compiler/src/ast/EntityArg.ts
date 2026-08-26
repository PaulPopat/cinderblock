import type { Closure, Variable } from "#runner";
import { EntityReferenceable } from "./EntityReferenceable.ts";
import type { Entry } from "./Entry.ts";
import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { Type } from "./Type.ts";
import { TypeArg } from "./TypeArg.ts";
import { TokenTypeName } from "#tokeniser";

export class EntityArg extends EntityReferenceable {
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

  get fullName() {
    return this.#name;
  }

  async reference(closure: Closure): Promise<Variable> {
    return closure.search(this.internalName, this.name, this.location);
  }

  get typeArg() {
    return new TypeArg(this.location, this.done, () => this, this.#type, this.#name);
  }
}
