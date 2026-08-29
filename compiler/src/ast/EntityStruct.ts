import { TypeArg } from "./TypeArg.ts";
import { Entity } from "./Entity.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import type { Entry } from "./Entry.ts";
import { TokenTypeName } from "#tokeniser";
import type { Closure } from "#runner";

export class EntityStruct extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^struct$/gm,
      factory: EntityStruct,
    });
  }

  readonly #name: string;
  readonly #args: Array<TypeArg>;

  constructor(walker: TokenWalker, parent: () => Entry | undefined) {
    const [{ name, args }, done] = walker
      .expect("struct", TokenTypeName.KeyWord)
      .text("name", TokenTypeName.StructName)
      .while(
        "args",
        (s) => s.data !== ";",
        (s) => TypeArg.Parse(s, () => this),
      )
      .expect(";", TokenTypeName.Punctuation)
      .finish();
    super(walker.location, done, parent);
    this.#name = name;
    this.#args = args;
  }

  get name() {
    return this.#name;
  }

  get args() {
    return this.#args;
  }

  get fullName() {
    return this.#name;
  }

  dig(name: string): Entry | undefined {
    if (name === this.name) return this;

    return undefined;
  }

  float(name: string): Entry | undefined {
    return undefined;
  }

  build(closure: Closure): Closure {
    return closure;
  }
}
