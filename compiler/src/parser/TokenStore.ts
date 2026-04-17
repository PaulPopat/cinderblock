import type { Token } from "./Token.ts";

export class TokenStore {
  static start(data: Array<Token>) {
    return new TokenStore(data, 0);
  }

  readonly #tokens: Array<Token>;
  readonly #index: number;

  private constructor(tokens: Array<Token>, index: number) {
    this.#tokens = tokens;
    this.#index = index;
  }

  get current() {
    const current = this.#tokens[this.#index];
    if (!current) throw new Error("At the end of the file");
    return current;
  }

  get data() {
    return this.current.data;
  }

  get location() {
    return this.current.location;
  }

  get done() {
    return this.#tokens.length <= this.#index;
  }

  get next() {
    return new TokenStore(this.#tokens, this.#index + 1);
  }

  get raw() {
    return this.#tokens;
  }
}
