import { Frame } from "./Frame.ts";
import { framise } from "./framise.ts";
import { Variable } from "./Variable.ts";

export class VariablePipeable extends Variable {
  readonly #execute: (args: Frame) => Promise<Variable>;
  readonly #noArgs: boolean;

  constructor(execute: (args: Frame) => Promise<Variable>, noArgs: boolean = false) {
    super();
    this.#execute = execute;
    this.#noArgs = noArgs;
  }

  execute(args: Frame): Promise<Variable> {
    return this.#execute(args);
  }

  get noArgs() {
    return this.#noArgs;
  }

  export() {
    if (this.#noArgs) {
      return this.#execute(new Frame({}));
    }

    return (args: Record<string, unknown>) => this.#execute(framise(args)).then((r) => r.export());
  }
}
