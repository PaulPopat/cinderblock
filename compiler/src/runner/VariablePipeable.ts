import type { Frame } from "./Frame.ts";
import { Variable } from "./Variable.ts";

export class VariablePipeable extends Variable {
  readonly #execute: (args: Frame) => Variable;
  readonly #noArgs: boolean;

  constructor(execute: (args: Frame) => Variable, noArgs: boolean = false) {
    super();
    this.#execute = execute;
    this.#noArgs = noArgs;
  }

  execute(args: Frame): Variable {
    return this.#execute(args);
  }

  get noArgs() {
    return this.#noArgs;
  }

  export() {
    throw new Error("Cannot serialise a pipeable");
  }
}
