export class Lazy<T> {
  readonly #factory: () => T;
  #instance: T | undefined = undefined;

  constructor(factory: () => T) {
    this.#factory = factory;
  }

  get value() {
    this.#instance ??= this.#factory();
    return this.#instance;
  }
}
