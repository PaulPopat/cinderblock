import type { CreateFunc } from "#writer";
import { Closure } from "./Closure.ts";
import { Frame } from "./Frame.ts";
import { framise } from "./framise.ts";
import { Func } from "./Func.ts";
import { VariablePipeable } from "./VariablePipeable.ts";

export class CompiledApp {
  readonly #globals: Frame;
  readonly #nameMap: Record<string, string>;
  readonly #closure: Closure;

  constructor(models: Array<CreateFunc>, nameMap: Record<string, string>, globals: Frame) {
    this.#globals = globals;
    this.#nameMap = nameMap;
    let closure = new Closure(this.#globals, [new Frame({})]);
    for (const model of models) {
      closure = closure.withVariable(model.name, new VariablePipeable((args) => new Func(model, closure.withFrame(args)).execute(), model.no_args));
    }

    this.#closure = closure;
  }
  async runInternal(target: string, args: Record<string, unknown>) {
    const found = this.#closure.search(target);
    if (!(found instanceof VariablePipeable)) throw new Error("Subject not found");

    const result = await found.execute(framise(args));
    return result.export();
  }

  async run(name: string, args: Record<string, unknown>) {
    const target = this.#nameMap[["App", name].join("_")];
    if (!target) throw new Error("Subject does not map");
    return this.runInternal(target, args);
  }
}
