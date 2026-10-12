import { TokenTypeName } from "#tokeniser";
import { Entity } from "./Entity.ts";
import { _context, type EntryContext } from "./EntryContext.ts";
import { Type } from "./Type.ts";

export class EntityExternal extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^extern$/gm,
      factory: (walker) => {
        const [{ name, type }, done] = walker
          .expect("extern", TokenTypeName.KeyWord)
          .text("name", TokenTypeName.FunctionName)
          .extract("type", (w) => Type.Parse(w))
          .expect(";", TokenTypeName.Punctuation)
          .finish();

        return new EntityExternal(_context(walker, done), name, type);
      },
    });
  }

  readonly #name: string;
  readonly #type: Type;

  constructor(ctx: EntryContext, name: string, type: Type) {
    super(ctx);
    this.#name = name;
    this.#type = type;
  }

  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
  }
}
