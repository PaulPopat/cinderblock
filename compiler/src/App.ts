import type { EntityLet } from "#ast";

export class App {
  readonly #lets: Array<EntityLet>;

  constructor(lets: Array<EntityLet>) {
    this.#lets = lets;
  }

  run(name: string, args: Record<string, unknown>) {
    const subject = this.#lets.find((l) => l.fullName === name);
    if (!subject) throw new Error("Subject not found");

    return subject.invoke(args);
  }

  get all() {
    return this.#lets;
  }

  withTag(key: string, value: unknown) {
    return this.#lets.filter((l) => l.tags.some((t) => t.key === key && t.value === value));
  }
}
