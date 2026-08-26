import { Entity } from "./Entity.ts";
import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import type { Entry } from "./Entry.ts";
import { EntityUse } from "./EntityUse.ts";
import { TokenTypeName } from "#tokeniser";

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

  constructor(walker: TokenWalker, parent: () => Entry | undefined) {
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
  }

  get name() {
    return this.#name;
  }

  get fullName() {
    return this.namespace;
  }

  get namespace(): string {
    return [this.parent()?.namespace, this.name].filter((r) => r).join("_");
  }

  get entities() {
    return this.#entities;
  }

  possibleNames(name: string) {
    return [
      name,
      [this.namespace, name].join("_"),
      ...this.namespace
        .split("_")
        .reduce((current, next) => [...current, [current[current.length - 1], next].filter((f) => f).join("_")], [] as Array<string>)
        .map((n) => [n, name].join("_")),
      ...this.#entities.filter((e) => e instanceof EntityUse).map((e) => [e.namespace, name].join("_")),
    ];
  }
}
