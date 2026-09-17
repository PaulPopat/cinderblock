import { EntityArg } from "./EntityArg.ts";
import { Expression } from "./Expression.ts";
import { Entity } from "./Entity.ts";
import { Type } from "./Type.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { EntryTag } from "./EntryTag.ts";
import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import type { Entry } from "./Entry.ts";
import { TokenTypeName } from "#tokeniser";
import { EntityNamespace } from "./EntityNamespace.ts";
import type { CreateFunc } from "#writer";
import { Namer } from "./Namer.ts";
import type { TypeArg } from "./TypeArg.ts";

export class EntityLet extends EntityNamespace {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^let$/gm,
      factory: EntityLet,
    });
  }

  readonly #walker: TokenWalker;
  readonly #tags: Array<EntryTag>;
  readonly #args: Array<EntityArg>;
  readonly #generics: Array<TypeArg>;
  readonly #returns: Type | undefined;
  readonly #contents: Expression;
  readonly #internalName: string;

  constructor(walker: TokenWalker, parent: () => Entry | undefined);
  constructor(base: EntityLet, generics: Array<TypeArg>);
  constructor(...input: [walker: TokenWalker, parent: () => Entry | undefined] | [base: EntityLet, generics: Array<TypeArg>]) {
    let generics: Array<TypeArg>;
    let internalName: string;
    let walker: TokenWalker;
    let parent: () => Entry | undefined;
    if (input[0] instanceof TokenWalker && typeof input[1] === "function") {
      [walker, parent] = input;
      generics = [];
      internalName = Namer.Next;
    } else {
      const [base, gen] = input as [base: EntityLet, generics: Array<TypeArg>];
      walker = base.#walker;
      parent = () => base.parent;
      generics = gen;
      internalName = base.#internalName;
    }

    const [{ name, args, returns, contents, tags, entities }, done] = walker
      .expect("let", TokenTypeName.KeyWord, () => this)
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
      .if(
        (s) => !!s.data.match(/^[a-zA-Z0-9_$#]+$/gm),
        (s) => s.text("name", TokenTypeName.FunctionName, () => this),
      )
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
      .expect("=", TokenTypeName.Operator, () => this)
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w, () => this),
      )
      .extract("contents", (s) => Expression.Parse(s, () => this, [";"]))
      .expect(";", TokenTypeName.Punctuation)
      .finish();

    super(walker.location, done, parent, name ?? internalName, entities);
    this.#walker = walker;
    this.#tags = tags ?? [];
    this.#args = args ?? [];
    this.#returns = returns;
    this.#contents = contents;
    this.#generics = generics;
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
    return (
      this.#args.reduce((result, arg) => result ?? arg.dig(name), undefined as Entry | undefined) ??
      this.#generics.reduce((result, arg) => result ?? arg.dig(name), undefined as Entry | undefined) ??
      super.float(name)
    );
  }

  get model(): Array<CreateFunc> {
    return [
      {
        name: this.#internalName,
        vars: [...this.topLevelEntities.flatMap((e) => e.model), ...this.#contents.funcs],
        returns: this.#contents.instruction,
        no_args: this.#args.length === 0,
        tags: Object.fromEntries(this.#tags.map((t) => [t.key, t.value?.toString() ?? ""])),
      },
    ];
  }
}
