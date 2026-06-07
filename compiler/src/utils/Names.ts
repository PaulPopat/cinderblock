export class Names {
  static #properties: Array<string>;
  static #current = 0;

  static get Next() {
    return this.#current++;
  }

  static get Properties() {
    return Object.freeze(this.#properties);
  }

  static PropertyName(name: string) {
    if (this.#properties.indexOf(name) === -1) {
      this.#properties = [...this.#properties, name];
    }

    return this.#properties.indexOf(name);
  }
}
