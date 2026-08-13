import { Variable } from "./Variable.ts";
import { VariableTuple } from "./VariableTuple.ts";

export class VariableArray extends VariableTuple {
  readonly #values: Array<Variable>;

  constructor(values: Array<Variable>) {
    super({});

    this.#values = values;
  }

  get data() {
    return [...this.#values];
  }

  export() {
    return this.#values.map((v) => v.export());
  }
}
