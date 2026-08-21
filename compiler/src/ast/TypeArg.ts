import type { TokenStore } from "#tokeniser";
import type { Location } from "#utils";
import type { Entry } from "./Entry.ts";
import { TokenWalker } from "./TokenWalker.ts";
import { Type } from "./Type.ts";

export class TypeArg extends Type {
  static Parse(walker: TokenWalker, parent: () => Entry | undefined) {
    const [{ name, type }, done] = walker
      .text("name")
      .expect(":")
      .extract("type", (w) => Type.Parse(w, parent))
      .finish();

    return new TypeArg(walker.location, done, parent, type, name.startsWith('"') ? JSON.parse(name) : name);
  }

  readonly #type: Type;
  readonly #name: string;

  constructor(location: Location, done: TokenStore, parent: () => Entry | undefined, type: Type, name: string) {
    super(location, done, parent);
    this.#type = type;
    this.#name = name.startsWith('"') ? JSON.parse(name) : name;
  }

  get type() {
    return this.#type;
  }

  get name() {
    return this.#name;
  }
}
