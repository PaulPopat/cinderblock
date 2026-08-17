import type { EntityLet } from "#ast";
import { Closure, Frame, framise, Variable, variablise } from "#runner";

export class App {
  readonly #lets: Array<EntityLet>;

  constructor(lets: Array<EntityLet>) {
    this.#lets = lets;
  }

  run(name: string, args: Record<string, unknown>) {
    const subject = this.#lets.find((l) => l.fullName === name);
    if (!subject) throw new Error("Subject not found");

    return subject.execute(new Closure([]), framise(args)).export();
  }
}
