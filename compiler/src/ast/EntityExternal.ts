import { TokenTypeName, TokenWalker } from "#tokeniser";
import { Entity } from "./Entity.ts";
import { Type } from "./Type.ts";
import type { Entry } from "./Entry.ts";
import type { CreateFunc } from "#writer";

export class EntityExternal extends Entity {
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

  dig(name: string): Entry | undefined {
    if (name === this.#name) return this;

    return undefined;
  }

  float(name: string): Entry | undefined {
    return this.parent?.float(name);
  }

  get model(): CreateFunc[] {
    return [];
  }
}
