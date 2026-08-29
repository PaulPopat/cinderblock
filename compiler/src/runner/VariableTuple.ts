import { Variable } from "./Variable.ts";

export class VariableTuple extends Variable {
  readonly #values: Record<string, Variable>;

  constructor(values: Record<string, Variable>) {
    super();
    this.#values = values;
  }

  get(name: string) {
    const result = this.#values[name];

    if (!result) throw new Error(`${name} not indexable`);

    return result;
  }

  has(name: string) {
    return !!this.#values[name];
  }

  export() {
    return Object.entries(this.#values).reduce((current, [key, val]) => ({ ...current, [key]: val.export() }), {} as Record<string, any>);
  }

  get entries() {
    return Object.entries(this.#values);
  }
}
