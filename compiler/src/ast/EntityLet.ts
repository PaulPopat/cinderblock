import { EntityArg } from "./EntityArg.ts";
import { Expression } from "./Expression.ts";
import { Entity } from "./Entity.ts";
import { Type } from "./Type.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { Namer } from "#runner";
import { EntryTag } from "./EntryTag.ts";
import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import type { Entry } from "./Entry.ts";
import { TokenTypeName } from "#tokeniser";
import { EntityNamespace } from "./EntityNamespace.ts";
import type { CreateFunc } from "#writer";

export class EntityLet extends EntityNamespace {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^let$/gm,
      factory: EntityLet,
    });
  }

  readonly #tags: Array<EntryTag>;
  readonly #args: Array<EntityArg>;
  readonly #returns: Type | undefined;
  readonly #contents: Expression;
  readonly #internalName = Namer.Next;

  constructor(walker: TokenWalker, parent: () => Entry | undefined) {
    const [{ name, args, returns, contents, tags, entities }, done] = walker
      .expect("let", TokenTypeName.KeyWord)
      .if(
        (s) => s.data === "[",
        (s) =>
          s
            .while(
              "tags",
              (s) => s.data === "[" || s.data === ",",
              (s) => new EntryTag(s.expect(["[", ","], TokenTypeName.Punctuation), () => this),
            )
            .expect("]", TokenTypeName.Punctuation),
      )
      .text("name", TokenTypeName.FunctionName)
      .if(
        (s) => s.data === "(",
        (walker) =>
          walker
            .while(
              "args",
              (s) => s.data === "," || s.data === "(",
              (s) => new EntityArg(s.expect(["(", ","], TokenTypeName.Punctuation), () => this),
            )
            .expect(")", TokenTypeName.Punctuation),
      )
      .if(
        (s) => s.data === ":",
        (walker) => walker.expect(":", TokenTypeName.Punctuation).extract("returns", (s) => Type.Parse(s, () => this)),
      )
      .expect("=", TokenTypeName.Operator)
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w, () => this),
      )
      .extract("contents", (s) => Expression.Parse(s, () => this, [";"]))
      .expect(";", TokenTypeName.Punctuation)
      .finish();

    super(walker.location, done, parent, name, entities);
    this.#tags = tags ?? [];
    this.#args = args ?? [];
    this.#returns = returns;
    this.#contents = contents;
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

  get fullName() {
    return this.namespace;
  }

  get namespace(): string {
    return [this.parent?.namespace, this.name].filter((r) => r).join("_");
  }

  get type() {
    const result = this.#returns ?? this.#contents.resolution;
    if (this.#args.length)
      return new TypePipeable(
        this.location,
        this.done,
        () => this,
        this.#args.map((a) => a.typeArg),
        result,
      );

    return result;
  }

  dig(name: string): Entry | undefined {
    if (name === this.name) return this;

    return super.dig(name);
  }

  float(name: string): Entry | undefined {
    return this.#args.reduce((result, arg) => result ?? arg.dig(name), undefined as Entry | undefined) ?? super.float(name);
  }

  get model(): Array<CreateFunc> {
    return [
      {
        name: this.#internalName,
        vars: this.topLevelEntities.flatMap((e) => e.model),
        returns: this.#contents.instruction,
        no_args: this.#args.length === 0,
        tags: Object.fromEntries(this.#tags.map((t) => [t.key, t.value?.toString() ?? ""])),
      },
    ];
  }
}
