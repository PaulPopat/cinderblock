import type { LinkedEntry } from "#linked/LinkedEntry";
import { LinkedExpressionTuple } from "#linked/LinkedExpressionTuple";
import { LinkedExternal } from "#linked/LinkedExternal";
import { TokenTypeName } from "#tokeniser";
import { Entity } from "./Entity.ts";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkerError } from "./LinkerError.ts";
import { Type } from "./Type.ts";

export class EntityExternal extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^extern$/gm,
      factory: (walker, namespace) => {
        const [{ name, type }, done] = walker
          .expect("extern", TokenTypeName.KeyWord)
          .text("name", TokenTypeName.FunctionName)
          .extract("type", (w) => Type.Parse(w))
          .expect(";", TokenTypeName.Punctuation)
          .finish();

        return new EntityExternal(_context(walker, done), namespace, name, type);
      },
    });
  }

  readonly #name: string;
  readonly #type: Type;

  constructor(ctx: EntryContext, namespace: string, name: string, type: Type) {
    super(ctx);
    this.#name = [namespace, name].filter((c) => c).join("_");
    this.#type = type;
  }

  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
  }

  linked(left: LinkedEntry | undefined, ctx: LinkerContext): [LinkerContext, LinkedExternal] {
    if (left && !(left instanceof LinkedExpressionTuple)) {
      throw new LinkerError("Invalid input", left.range);
    }

    return ctx.with("type", (c) => this.#type.linked(left?.resolution, c)).finish(({ type }) => new LinkedExternal(this.range, this.#name, type));
  }

  search(name: string): Array<Entity> {
    return name === this.#name ? [this] : [];
  }
}
