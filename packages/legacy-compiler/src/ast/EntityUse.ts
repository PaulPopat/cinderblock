import { Entity } from "./Entity.ts";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc } from "#writer";
import { _context, type EntryContext } from "./EntryContext.ts";

export class EntityUse extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^use$/gm,
      factory: (walker) => {
        const [{ namespace }, done] = walker
          .expect("use", TokenTypeName.KeyWord)
          .text("namespace", TokenTypeName.Namespace)
          .expect(";", TokenTypeName.Punctuation)
          .finish();

        return new EntityUse(_context(walker, done), namespace);
      },
    });
  }

  readonly #namespace: string;

  constructor(ctx: EntryContext, namespace: string) {
    super(ctx);
    this.#namespace = namespace;
  }

  get name(): string {
    throw this.#namespace;
  }
}
