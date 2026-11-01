import { Entity } from "./Entity.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { EntityLet } from "./EntityLet.ts";

export class EntityNamespace extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^namespace$/gm,
      factory: (walker, namespace) => {
        const [{ name, entities }, done] = walker
          .expect("namespace", TokenTypeName.KeyWord)
          .text("name", TokenTypeName.Namespace)
          .expect("{", TokenTypeName.Punctuation)
          .while(
            "entities",
            (s) => Entity.HasParser(s),
            (w, _, { name }) => Entity.Parse(w, [namespace, name].filter((c) => c).join("_")),
          )
          .expect("}", TokenTypeName.Punctuation)
          .finish();

        return new EntityNamespace(_context(walker, done, namespace), [namespace, name].filter((c) => c).join("_"), entities);
      },
    });
  }

  readonly #name: string;
  readonly #entities: Array<Entity>;

  constructor(ctx: EntryContext, name: string, entities: Array<Entity>) {
    super(ctx);
    this.#name = name;
    this.#entities = entities;
  }

  get name() {
    return this.#name;
  }

  get entities() {
    return this.#entities;
  }

  search(name: string, ctx: LinkerContext, skip_usings: boolean): Array<Entity> {
    return this.#entities.flatMap((e) => e.search(name, ctx, skip_usings));
  }

  get public(): Array<EntityLet> {
    return this.#entities.reduce(
      (result, entity) => (entity instanceof EntityLet || entity instanceof EntityNamespace ? [...result, ...entity.public] : result),
      [] as Array<EntityLet>,
    );
  }
}
