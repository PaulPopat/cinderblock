export class Names {
  static #current = 0;

  static get Next() {
    return this.#current++;
  }
}
