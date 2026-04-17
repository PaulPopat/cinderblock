export class Location {
  readonly #file: string;
  readonly #line: number;
  readonly #character: number;

  constructor(file: string, line: number, character: number) {
    this.#file = file;
    this.#line = line;
    this.#character = character;
  }

  get file() {
    return this.#file;
  }

  get line() {
    return this.#line;
  }

  get character() {
    return this.#character;
  }
}
