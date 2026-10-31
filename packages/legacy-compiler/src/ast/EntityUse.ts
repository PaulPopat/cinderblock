import { Entity } from "./Entity.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";

export class EntityUse extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^use$/gm,
      factory: (walker, existing) => {
        const [{ namespace }, done] = walker
          .expect("use", TokenTypeName.KeyWord)
          .text("namespace", TokenTypeName.Namespace)
          .expect(";", TokenTypeName.Punctuation)
          .finish();

        return new EntityUse(_context(walker, done, existing), namespace);
      },
    });
  }

  readonly #namespace: string;

  constructor(ctx: EntryContext, namespace: string) {
    super(ctx);
    this.#namespace = namespace;
  }

  get name(): string {
    return this.#namespace;
  }

  search(name: string, ctx: LinkerContext): Array<Entity> {
    if (name.startsWith(this.#namespace + "_")) return [];
    return ctx.base.search([this.#namespace, name].join("_"), ctx);
  }
}
