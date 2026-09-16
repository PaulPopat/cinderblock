import { Entity } from "./Entity.ts";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc } from "#writer";

export class EntityUse extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^use$/gm,
      factory: this,
    });
  }

  readonly #namespace: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined) {
    const [{ namespace }, done] = walker
      .expect("use", TokenTypeName.KeyWord)
      .text("namespace", TokenTypeName.Namespace)
      .expect(";", TokenTypeName.Punctuation)
      .finish();
    super(walker.location, done, parent);
    this.#namespace = namespace;
  }

  get name(): string {
    throw this.#namespace;
  }

  get namespace() {
    return this.#namespace;
  }

  get fullName() {
    return "";
  }

  dig(name: string): Entry | undefined {
    if (name.startsWith(this.#namespace + "_")) return undefined;

    return this.float([this.#namespace, name].join("_"));
  }

  float(name: string): Entry | undefined {
    return this.parent?.float(name);
  }

  get model(): CreateFunc[] {
    return [];
  }
}
