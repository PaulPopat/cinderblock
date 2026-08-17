import type { Variable } from "./Variable.ts";

export class Frame {
  readonly #variables: Record<string, Variable | undefined>;

  constructor(variables: Record<string, Variable | undefined>) {
    this.#variables = variables;
  }

  search(name: string) {
    return this.#variables[name];
  }

  withVariable(name: string, value: Variable) {
    return new Frame({ ...this.#variables, [name]: value });
  }

  export() {
    return Object.fromEntries(Object.entries(this.#variables).map(([key, value]) => [key, value?.export()]));
  }
}
