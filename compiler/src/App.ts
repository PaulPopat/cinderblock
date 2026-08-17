import { EntityLet } from "#ast";
import { Closure, framise } from "#runner";

export class App {
  readonly #lets: Array<EntityLet>;

  constructor(lets: Array<EntityLet>) {
    this.#lets = lets;
  }

  async run(name: string | EntityLet, args: Record<string, unknown>) {
    if (name instanceof EntityLet) name = name.fullName;
    const subject = this.#lets.find((l) => l.fullName === name);
    if (!subject) throw new Error("Subject not found");

    const result = await subject.execute(new Closure([]), framise(args));
    return result.export();
  }

  get all() {
    return this.#lets;
  }

  withTag(key: string, value: unknown) {
    return this.#lets.filter((l) => l.tags.some((t) => t.key === key && t.value === value));
  }
}
