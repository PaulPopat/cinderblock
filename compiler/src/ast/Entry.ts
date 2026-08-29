import type { Location } from "#utils";
import type { TokenWalker } from "#tokeniser";

export abstract class Entry {
  readonly #location: Location;
  readonly #done: TokenWalker;
  readonly #parent: () => Entry | undefined;

  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined) {
    this.#location = location;
    this.#done = done;
    this.#parent = parent;
  }

  get parent() {
    return this.#parent();
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

  abstract float(name: string): Entry | undefined;
  abstract dig(name: string): Entry | undefined;

  get namespace(): string {
    return this.#parent()?.namespace ?? "";
  }
}
