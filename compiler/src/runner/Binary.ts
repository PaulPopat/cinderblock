import type { CreateFunc } from "#writer";
import { readFileSync } from "node:fs";
import { Closure } from "./Closure.ts";
import { Frame } from "./Frame.ts";
import { framise } from "./framise.ts";
import { Func } from "./Func.ts";
import * as std from "#std";
import { VariablePipeable } from "./VariablePipeable.ts";

export class Binary {
  static FromFile(path: string, globals: Record<string, unknown>) {
    const { data, names } = JSON.parse(readFileSync(path, "utf8"));
    return new Binary(data, names, globals);
  }

  readonly #models: Array<CreateFunc>;
  readonly #globals: Frame;
  readonly #nameMap: Record<string, string>;
  readonly #closure: Closure;

  constructor(models: Array<CreateFunc>, nameMap: Record<string, string>, globals: Record<string, unknown>) {
    this.#models = models;
    this.#globals = framise({ ...std, ...globals });
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

  async runFromModel(model: CreateFunc, args: Record<string, unknown>) {
    return this.runInternal(model.name, args);
  }

  async run(name: string, args: Record<string, unknown>) {
    const target = this.#nameMap[["App", name].join("_")];
    if (!target) throw new Error("Subject does not map");
    return this.runInternal(target, args);
  }

  withTag(key: string, value: string) {
    return this.#models.filter((m) => m.tags[key] === value);
  }
}
