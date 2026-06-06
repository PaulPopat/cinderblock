export class OperationPrepareRoutine {
  readonly #name: number;

  constructor(name: number) {
    this.#name = name;
  }

  get name() {
    return this.#name;
  }
}
