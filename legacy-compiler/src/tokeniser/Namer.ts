export class Namer {
  static get Start() {
    return new Namer([33]);
  }

  readonly #current: Array<number>;

  private constructor(current: Array<number>) {
    this.#current = current;
  }

  get next() {
    const final = this.#current[this.#current.length - 1];
    return new Namer(typeof final !== "number" || final === 126 ? [...this.#current, 33] : [...this.#current.slice(0, -1), final + 1]);
  }

  get name() {
    return String.fromCharCode(...this.#current);
  }
}
