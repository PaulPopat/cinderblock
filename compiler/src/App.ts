import { Entity, EntityLet, Entry } from "#ast";
import { Closure, framise } from "#runner";
import { TokenStore } from "#tokeniser";
import { Location } from "#utils";

export abstract class App extends Entry {
  abstract get entities(): Array<Entity>;

  constructor() {
    super(Location.empty, TokenStore.start([]), undefined);
  }

  find(name: string): Entry | undefined {
    return this.entities.find((s) => s.fullName === name);
  }

  async run(name: string | EntityLet, args: Record<string, unknown>) {
    if (name instanceof EntityLet) name = name.fullName;
    const subject = this.entities.find((l) => l.fullName === name);
    if (!(subject instanceof EntityLet)) throw new Error("Subject not found");

    const result = await subject.execute(new Closure([]), framise(args));
    return result.export();
  }

  get all() {
    return this.entities;
  }

  withTag(key: string, value: unknown) {
    return this.entities.filter((e) => e instanceof EntityLet).filter((l) => l.tags.some((t) => t.key === key && t.value === value));
  }
}
