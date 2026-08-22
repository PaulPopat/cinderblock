import type { Variable } from "./Variable.ts";

export class Frame {
  readonly #variables: Record<string, Variable | Promise<Variable> | undefined>;

  constructor(variables: Record<string, Variable | Promise<Variable> | undefined>) {
    this.#variables = variables;
  }

  search(name: string) {
    return this.#variables[name];
  }

  /**
   * @mutates
   */
  withVariable(name: string, value: Variable | Promise<Variable>) {
    this.#variables[name] = value;
    return this;
  }

  async export() {
    return Object.fromEntries(await Promise.all(Object.entries(this.#variables).map(async ([key, value]) => [key, await (await value)?.export()])));
  }
}
