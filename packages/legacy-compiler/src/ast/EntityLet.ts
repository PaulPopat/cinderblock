import { EntityArg } from "./EntityArg.ts";
import { Expression } from "./Expression.ts";
import { Entity } from "./Entity.ts";
import { Type } from "./Type.ts";
import { EntryTag } from "./EntryTag.ts";
import { TokenTypeName } from "#tokeniser";
import { EntityNamespace } from "./EntityNamespace.ts";
import { _context, type EntryContext } from "./EntryContext.ts";

export class EntityLet extends EntityNamespace {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^let$/gm,
      factory: (walker) => {
        const [{ name, args, returns, contents, tags, entities, internalName }, done] = walker
          .expect("let", TokenTypeName.KeyWord)
          .internal("internalName")
          .if(
            (s) => s.data === "[",
            (s) =>
              s
                .while(
                  "tags",
                  (s) => s.data === "[" || s.data === ",",
                  (s) => EntryTag.Parse(s.expect(["[", ","], TokenTypeName.Punctuation)),
                )
                .expect("]", TokenTypeName.Punctuation),
          )
          .if(
            (s) => !!s.data.match(/^[a-zA-Z0-9_$#]+$/gm),
            (s) => s.text("name", TokenTypeName.FunctionName),
          )
          .if(
            (s) => s.data === "(",
            (walker) =>
              walker
                .while(
                  "args",
                  (s) => s.data === "," || s.data === "(",
                  (s) => EntityArg.Parse(s.expect(["(", ","], TokenTypeName.Punctuation)),
                )
                .expect(")", TokenTypeName.Punctuation),
          )
          .if(
            (s) => s.data === ":",
            (walker) => walker.expect(":", TokenTypeName.Punctuation).extract("returns", (s) => Type.Parse(s)),
          )
          .expect("=", TokenTypeName.Operator)
          .while(
            "entities",
            (s) => Entity.HasParser(s),
            (w) => Entity.Parse(w),
          )
          .extract("contents", (s) => Expression.Parse(s, [";"]))
          .expect(";", TokenTypeName.Punctuation)
          .finish();

        return new EntityLet(_context(walker, done), name ?? internalName, entities, tags ?? [], args ?? [], returns, contents, internalName);
      },
    });
  }

  readonly #tags: Array<EntryTag>;
  readonly #args: Array<EntityArg>;
  readonly #returns: Type | undefined;
  readonly #contents: Expression;
  readonly #internalName: string;

  constructor(
    ctx: EntryContext,
    name: string,
    entities: Array<Entity>,
    tags: Array<EntryTag>,
    args: Array<EntityArg>,
    returns: Type | undefined,
    contents: Expression,
    internalName: string,
  ) {
    super(ctx, name, entities);
    this.#tags = tags;
    this.#args = args;
    this.#returns = returns;
    this.#contents = contents;
    this.#internalName = internalName;
  }

  get tags() {
    return this.#tags;
  }

  get internalName() {
    return this.#internalName;
  }

  get args() {
    return this.#args;
  }

  get returns() {
    return this.#returns;
  }

  get contents() {
    return this.#contents;
  }
}
