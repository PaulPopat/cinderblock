import { Entity } from "./Entity.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";

export class EntityNamespace extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^namespace$/gm,
      factory: (walker) => {
        const [{ name, entities }, done] = walker
          .expect("namespace", TokenTypeName.KeyWord)
          .text("name", TokenTypeName.Namespace)
          .expect("{", TokenTypeName.Punctuation)
          .while(
            "entities",
            (s) => Entity.HasParser(s),
            (w) => Entity.Parse(w),
          )
          .expect("}", TokenTypeName.Punctuation)
          .finish();

        return new EntityNamespace(_context(walker, done), name, entities);
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

  get entities(): Array<Entity> {
    return this.#entities.flatMap((e) => (e instanceof EntityNamespace ? [e, ...e.entities] : [e]));
  }

  get topLevelEntities(): Array<Entity> {
    return this.#entities;
  }
}
