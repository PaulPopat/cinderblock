import { Closure, Namer, type Variable } from "#runner";
import { TokenTypeName, TokenWalker } from "#tokeniser";
import { Entity } from "./Entity.ts";
import type { IEntityReferenceable } from "./IEntityReferenceable.ts";
import { Type } from "./Type.ts";
import type { Entry } from "./Entry.ts";
import type { CreateFunc } from "#writer";

export class EntityExternal extends Entity implements IEntityReferenceable {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^extern$/gm,
      factory: this,
    });
  }

  readonly #name: string;
  readonly #type: Type;

  constructor(walker: TokenWalker, parent: () => Entry | undefined) {
    const [{ name, type }, done] = walker
      .expect("extern", TokenTypeName.KeyWord)
      .text("name", TokenTypeName.FunctionName)
      .extract("type", (w) => Type.Parse(w, () => this))
      .expect(";", TokenTypeName.Punctuation)
      .finish();

    super(walker.location, done, parent);
    this.#name = name;
    this.#type = type;
  }

  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
  }

  get internalName() {
    return this.#name;
  }

  async reference(closure: Closure): Promise<Variable> {
    return closure.searchGlobal(this.#name);
  }

  dig(name: string): Entry | undefined {
    if (name === this.#name) return this;

    return undefined;
  }

  float(name: string): Entry | undefined {
    return this.parent?.float(name);
  }

  build(closure: Closure): Closure {
    return closure.withVariable(this.#name, this.reference(closure));
  }

  get model(): CreateFunc[] {
    return [];
  }
}
