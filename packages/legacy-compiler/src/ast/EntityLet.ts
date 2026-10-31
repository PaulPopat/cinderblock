import { EntityArg } from "./EntityArg.ts";
import { Expression } from "./Expression.ts";
import { Entity } from "./Entity.ts";
import { Type } from "./Type.ts";
import { EntryTag } from "./EntryTag.ts";
import { TokenTypeName } from "#tokeniser";
import { _context, type EntryContext } from "./EntryContext.ts";
import type { LinkedEntry } from "#linked/LinkedEntry";
import type { LinkerContext } from "./LinkerContext.ts";
import { LinkedExpression } from "#linked/LinkedExpression";
import { LinkerError } from "./LinkerError.ts";
import { LinkedTypeTuple } from "#linked/LinkedTypeTuple";
import { LinkedExpressionLet } from "#linked/LinkedExpressionLet";

export class EntityLet extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^(let|export)$/gm,
      factory: (walker, namespace) => {
        const [{ name, args, returns, contents, tags, entities, internalName }, done] = walker
          .if(
            (s) => s.data === "export",
            (s) => s.expect("export", TokenTypeName.KeyWord),
          )
          .expect("let", TokenTypeName.KeyWord)
          .internal("internalName")
          .if(
            (s) => s.data === "[",
            (s) =>
              s
                .while(
                  "tags",
                  (s) => s.data === "[" || s.data === ",",
                  (s) => EntryTag.Parse(s.expect(["[", ","], TokenTypeName.Punctuation), namespace),
                )
                .expect("]", TokenTypeName.Punctuation),
          )
          .if(
            (s) => !!s.data.match(/^[a-zA-Z0-9_$#]+$/gm),
            (s) => s.text("name", TokenTypeName.FunctionName),
          )
          .if(
            (s) => s.data === "(",
            (walker, { name }) =>
              walker
                .while(
                  "args",
                  (s) => s.data === "," || s.data === "(",
                  (s) => EntityArg.Parse(s.expect(["(", ","], TokenTypeName.Punctuation), [namespace, name].filter((n) => n).join("_")),
                )
                .expect(")", TokenTypeName.Punctuation),
          )
          .if(
            (s) => s.data === ":",
            (walker, { name }) =>
              walker.expect(":", TokenTypeName.Punctuation).extract("returns", (s) => Type.Parse(s, [namespace, name].filter((n) => n).join("_"))),
          )
          .expect("=", TokenTypeName.Operator)
          .while(
            "entities",
            (s) => Entity.HasParser(s),
            (w, _, { name, internalName }) => Entity.Parse(w, [namespace, name ?? internalName].join("_")),
          )
          .extract("contents", (s, { name }) => Expression.Parse(s, [namespace, name].filter((n) => n).join("_"), [";"]))
          .expect(";", TokenTypeName.Punctuation)
          .finish();

        return new EntityLet(
          _context(walker, done, namespace),
          name ?? internalName,
          namespace,
          entities,
          walker.data === "export",
          tags ?? [],
          args ?? [],
          returns,
          contents,
          internalName,
        );
      },
    });
  }

  readonly #name: string;
  readonly #namespace: string;
  readonly #entities: Array<Entity>;
  readonly #exported: boolean;
  readonly #tags: Array<EntryTag>;
  readonly #args: Array<EntityArg>;
  readonly #returns: Type | undefined;
  readonly #contents: Expression;
  readonly #internalName: string;

  constructor(
    ctx: EntryContext,
    name: string,
    namespace: string,
    entities: Array<Entity>,
    exported: boolean,
    tags: Array<EntryTag>,
    args: Array<EntityArg>,
    returns: Type | undefined,
    contents: Expression,
    internalName: string,
  ) {
    super(ctx);
    this.#name = name;
    this.#namespace = namespace;
    this.#entities = entities;
    this.#exported = exported;
    this.#tags = tags;
    this.#args = args;
    this.#returns = returns;
    this.#contents = contents;
    this.#internalName = internalName;
  }

  get name(): string {
    return this.#name;
  }

  get fullname(): string {
    return [this.#namespace, this.#name].filter((c) => c).join("_");
  }

  get exported() {
    return this.#exported;
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

  linked(input: LinkedEntry | undefined, ctx: LinkerContext): [LinkerContext, LinkedExpressionLet] {
    if (input && !(input instanceof LinkedExpression)) {
      throw new LinkerError("Invalid input", input.range);
    }

    const inputType = input?.resolution ?? LinkedTypeTuple.empty;
    if (!(inputType instanceof LinkedTypeTuple) && this.#args.length > 0) {
      throw new LinkerError("Tuple required", inputType.range);
    }

    return ctx
      .mapWith(this.#args, "args", (c, i) =>
        i.linked(inputType instanceof LinkedTypeTuple ? inputType.args.find((a) => a.name === i.name) : undefined, c),
      )
      .mapWith(
        this.#entities.filter((e) => e instanceof EntityLet),
        "children",
        (c, e) => e.linked(undefined, c),
      )
      .with("contents", (c) => this.#contents.linked(undefined, c))
      .with("returns", (c, { contents }) => this.#returns?.linked(undefined, c) ?? [ctx, contents.resolution])
      .finishSearchable(this.name, ({ args, contents, returns, children }) => {
        return new LinkedExpressionLet(this.range, this.#internalName, args, returns, children, contents);
      });
  }

  search(name: string): Array<Entity> {
    return name === this.name ? [this] : [];
  }

  get public(): Array<EntityLet> {
    return this.#exported ? [this] : [];
  }
}
