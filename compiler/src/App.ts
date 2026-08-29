import { Entity, EntityLet, EntityNamespace } from "#ast";
import { Frame, framise } from "#runner";
import { TokenWalker } from "#tokeniser";
import { Lazy, Location } from "#utils";
import * as std from "#std";
import { CompiledApp } from "./runner/CompiledApp.ts";

export abstract class App extends EntityNamespace {
  readonly #globals: Frame;

  readonly #compiled = new Lazy(
    () =>
      new CompiledApp(
        this.topLevelEntities.flatMap((e) => e.model),
        Object.fromEntries(this.entities.filter((e) => e instanceof EntityLet).map((e) => [e.fullName, e.internalName])),
        this.#globals,
      ),
  );

  constructor(entities: Array<Entity>, globals: Record<string, unknown>) {
    super(Location.empty, TokenWalker.start([]), () => undefined, "App", entities);
    this.#globals = framise({ ...std, ...globals });
  }

  async run(name: string | EntityLet, args: Record<string, unknown>) {
    return name instanceof EntityLet ? this.#compiled.value.runInternal(name.internalName, args) : this.#compiled.value.run(name, args);
  }

  get all() {
    return this.entities;
  }

  withTag(key: string, value: unknown) {
    return this.entities.filter((e) => e instanceof EntityLet).filter((l) => l.tags.some((t) => t.key === key && t.value === value));
  }
}
