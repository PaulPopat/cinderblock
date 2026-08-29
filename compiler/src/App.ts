import { Entity, EntityLet, EntityNamespace, Entry } from "#ast";
import { Closure, Frame, framise } from "#runner";
import { TokenWalker } from "#tokeniser";
import { Lazy, Location } from "#utils";
import * as std from "#std";

export abstract class App extends EntityNamespace {
  readonly #globals: Frame;

  constructor(entities: Array<Entity>, globals: Record<string, unknown>) {
    super(Location.empty, TokenWalker.start([]), () => undefined, "App", entities);
    this.#globals = framise({ ...std, ...globals });
  }

  async run(name: string | EntityLet, args: Record<string, unknown>) {
    const closure = this.build(new Closure(this.#globals, [new Frame({})]));
    if (name instanceof EntityLet) name = name.fullName;
    const subject = this.dig(name.startsWith("App_") ? name : ["App", name].join("_"));
    if (!(subject instanceof EntityLet)) throw new Error("Subject not found");

    const result = await subject.execute(closure, framise(args));
    return result.export();
  }

  get all() {
    return this.entities;
  }

  withTag(key: string, value: unknown) {
    return this.entities.filter((e) => e instanceof EntityLet).filter((l) => l.tags.some((t) => t.key === key && t.value === value));
  }
}
