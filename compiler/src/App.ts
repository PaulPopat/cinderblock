import { Entity, EntityLet, EntityNamespace, Entry } from "#ast";
import { Closure, Frame, framise } from "#runner";
import { TokenWalker } from "#tokeniser";
import { Lazy, Location } from "#utils";
import { EntityReferenceable } from "./ast/EntityReferenceable.ts";

export abstract class App extends Entry {
  abstract get entities(): Array<Entity>;

  constructor() {
    super(Location.empty, TokenWalker.start([]), () => undefined);
  }

  readonly flatEntities = new Lazy(() => this.entities.flatMap((e) => (e instanceof EntityNamespace ? e.entities : [e])));

  find(name: string): Entry | undefined {
    return this.flatEntities.value.find((s) => s.fullName === name);
  }

  get #closure() {
    return this.flatEntities.value
      .filter((entity) => entity instanceof EntityReferenceable)
      .reduce((closure, entity) => closure.withVariable(entity.internalName, entity.reference(closure)), new Closure([new Frame({})]));
  }

  async run(name: string | EntityLet, args: Record<string, unknown>) {
    if (name instanceof EntityLet) name = name.fullName;
    const subject = this.find(name);
    if (!(subject instanceof EntityLet)) throw new Error("Subject not found");

    const result = await subject.execute(this.#closure, framise(args));
    return result.export();
  }

  get all() {
    return this.flatEntities;
  }

  withTag(key: string, value: unknown) {
    return this.flatEntities.value.filter((e) => e instanceof EntityLet).filter((l) => l.tags.some((t) => t.key === key && t.value === value));
  }
}
