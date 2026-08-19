import { TypeArg } from "./TypeArg.ts";
import { Entity } from "./Entity.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import type { Entry } from "./Entry.ts";

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

  constructor(walker: TokenWalker, parent: Entry | undefined) {
    const [{ name, args }, done] = walker
      .expect("struct")
      .text("name")
      .while(
        "args",
        (s) => s.data !== ";",
        (s) => TypeArg.Parse(s, this),
      )
      .expect(";")
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
}
