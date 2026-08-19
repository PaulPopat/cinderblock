import { Entity } from "./Entity.ts";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "./TokenWalker.ts";

export class EntityUse extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^use$/gm,
      factory: this,
    });
  }

  readonly #namespace: string;

  constructor(walker: TokenWalker, parent: Entry | undefined) {
    const [{ namespace }, done] = walker.expect("use").text("namespace").expect(";").finish();
    super(walker.location, done, parent);
    this.#namespace = namespace;
  }

  get namespace() {
    return this.#namespace;
  }
}
