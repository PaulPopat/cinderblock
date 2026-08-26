import { EntityArg } from "./EntityArg.ts";
import { Expression } from "./Expression.ts";
import { Entity } from "./Entity.ts";
import { Type } from "./Type.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { Closure, Frame, Namer, VariablePipeable, type Variable } from "#runner";
import { EntryTag } from "./EntryTag.ts";
import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import type { Entry } from "./Entry.ts";
import { EntityUse } from "./EntityUse.ts";
import { EntityReferenceable } from "./EntityReferenceable.ts";
import { TokenTypeName } from "#tokeniser";

export class EntityLet extends EntityReferenceable {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^let$/gm,
      factory: EntityLet,
    });
  }

  readonly #name: string;
  readonly #tags: Array<EntryTag>;
  readonly #args: Array<EntityArg>;
  readonly #entities: Array<Entity>;
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

    super(walker.location, done, parent);
    this.#name = name;
    this.#tags = tags ?? [];
    this.#args = args ?? [];
    this.#entities = entities.filter((e) => e instanceof Entity);
    this.#returns = returns;
    this.#contents = contents;
  }

  get name() {
    return this.#name;
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
    return [this.parent()?.namespace, this.name].filter((r) => r).join("_");
  }

  possibleNames(name: string) {
    return [
      name,
      [this.namespace, name].join("_"),
      ...this.namespace
        .split("_")
        .reduce((current, next) => [...current, [current[current.length - 1], next].filter((f) => f).join("_")], [] as Array<string>)
        .map((n) => [n, name].join("_")),
      ...this.#entities.filter((e) => e instanceof EntityUse).map((e) => [e.namespace, name].join("_")),
    ];
  }

  find(name: string): Entry | undefined {
    for (const arg of this.#args) {
      if (arg.name === name) return arg;
    }

    for (const possible of this.possibleNames(name)) {
      const found = this.#entities.find((s) => s.fullName === possible);
      if (found) return found;
    }

    for (const possible of this.possibleNames(name)) {
      const found = super.find(possible);
      if (found) return found;
    }
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

  async reference(closure: Closure): Promise<Variable> {
    if (!this.#args.length) {
      return this.execute(closure, new Frame({}));
    }

    return new VariablePipeable((a) => this.execute(closure, a), !this.args.length);
  }

  async execute(closure: Closure, args: Frame): Promise<Variable> {
    return this.#contents.resolve(
      this.#entities
        .filter((entity) => entity instanceof EntityReferenceable)
        .reduce((closure, entity) => closure.withVariable(entity.internalName, entity.reference(closure)), closure.withFrame(args)),
    );
  }
}
