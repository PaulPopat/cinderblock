import type { TokenStore } from "#tokeniser";
import type { Location } from "#utils";
import type { TokenWalker } from "./TokenWalker.ts";

export abstract class Entry {
  readonly #location: Location;
  readonly #done: TokenStore;
  readonly #parent: Entry | undefined;

  constructor(location: Location, done: TokenStore, parent: Entry | undefined) {
    this.#location = location;
    this.#done = done;
    this.#parent = parent;
  }

  get parent() {
    return this.#parent;
  }

  get location() {
    return this.#location;
  }

  get end() {
    return this.#done.location;
  }

  get done() {
    return this.#done;
  }

  find(name: string): Entry | undefined {
    return this.#parent?.find(name);
  }

  get namespace(): string {
    return this.#parent?.namespace ?? "";
  }
}
