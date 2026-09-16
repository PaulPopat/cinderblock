import { Entity } from "./Entity.ts";
import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import type { Entry } from "./Entry.ts";
import { TokenTypeName } from "#tokeniser";
import { type Location } from "#utils";
import type { CreateFunc } from "#writer";
import type { TypeTuple } from "./TypeTuple.ts";

export class EntityNamespace extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^namespace$/gm,
      factory: this,
    });
  }

  readonly #name: string;
  readonly #entities: Array<Entity>;

  constructor(walker: TokenWalker, parent: () => Entry | undefined);
  constructor(location: Location, done: TokenWalker, parent: () => Entry | undefined, name: string, entities: Array<Entity>);
  constructor(
    ...args:
      | [walker: TokenWalker, parent: () => Entry | undefined]
      | [location: Location, done: TokenWalker, parent: () => Entry | undefined, name: string, entities: Array<Entity>]
  ) {
    if (args.length === 2) {
      const [walker, parent] = args;
      const [{ name, entities }, done] = walker
        .expect("namespace", TokenTypeName.KeyWord)
        .text("name", TokenTypeName.Namespace)
        .expect("{", TokenTypeName.Punctuation)
        .while(
          "entities",
          (s) => Entity.HasParser(s),
          (w) => Entity.Parse(w, () => this),
        )
        .expect("}", TokenTypeName.Punctuation)
        .finish();

      super(walker.location, done, parent);
      this.#name = name;
      this.#entities = entities.filter((e) => e instanceof Entity);
    } else {
      const [location, done, parent, name, entities] = args;
      super(location, done, parent);
      this.#name = name;
      this.#entities = entities;
    }
  }

  get name() {
    return this.#name;
  }

  get fullName() {
    return this.namespace;
  }

  get namespace(): string {
    return [this.parent?.namespace, this.name].filter((r) => r).join("_");
  }

  get entities(): Array<Entity> {
    return this.#entities.flatMap((e) => (e instanceof EntityNamespace ? [e, ...e.entities] : [e]));
  }

  get topLevelEntities(): Array<Entity> {
    return this.#entities;
  }

  dig(name: string): Entry | undefined {
    if (!name.startsWith(this.#name + "_")) return;
    const digName = name.replace(this.#name + "_", "");
    return this.#entities.reduce((result, entity) => result ?? entity.dig(digName), undefined as Entry | undefined);
  }

  float(name: string): Entry | undefined {
    const buildUp = this.#name
      .split("_")
      .reduce((current, next) => [...current, [current[current.length - 1], next].filter((l) => l).join("_")], [] as Array<string>);
    const possible = [name, ...buildUp.map((n) => [n, name].join("_"))];
    for (const p of possible) {
      const potential = this.dig(p);
      if (potential) return potential;
    }

    return possible.reduce((result, n) => result ?? this.parent?.float(n), undefined as Entry | undefined);
  }

  get model(): CreateFunc[] {
    return this.#entities.flatMap((e) => e.model);
  }
}
