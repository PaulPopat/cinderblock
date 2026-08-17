export class Lazy<T> {
  readonly #init: () => Promise<T>;
  #value: Promise<T> | undefined = undefined;

  constructor(init: () => Promise<T>) {
    this.#init = init;
  }

  get value() {
    this.#value ??= this.#init();
    return this.#value;
  }
}
