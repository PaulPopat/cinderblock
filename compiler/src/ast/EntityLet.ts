import { EntityArg } from "./EntityArg.ts";
import { Expression } from "./Expression.ts";
import { Entity } from "./Entity.ts";
import { Type } from "./Type.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { Closure, Namer, VariablePipeable, type Frame, type Variable } from "#runner";
import { EntryTag } from "./EntryTag.ts";
import { EntityExternal } from "./EntityExternal.ts";
import { TokenWalker } from "./TokenWalker.ts";
import type { Entry } from "./Entry.ts";
import { EntityUse } from "./EntityUse.ts";

export class EntityLet extends Entity {
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

  constructor(walker: TokenWalker, parent: Entry | undefined) {
    const [{ name, args, returns, contents, tags, entities }, done] = walker
      .expect("let")
      .if(
        (s) => s.data === "[",
        (s) =>
          s
            .while(
              "tags",
              (s) => s.data === "[" || s.data === ",",
              (s) => new EntryTag(s.next, this),
            )
            .expect("]"),
      )
      .text("name")
      .if(
        (s) => s.data === "(",
        (walker) =>
          walker
            .while(
              "args",
              (s) => s.data === "," || s.data === "(",
              (s) => new EntityArg(walker, this),
            )
            .expect(")"),
      )
      .if(
        (s) => s.data === ":",
        (walker) => walker.expect(":").extract("returns", (s) => Type.Parse(s, this)),
      )
      .expect("=")
      .while(
        "entities",
        (s) => Entity.HasParser(s),
        (w) => Entity.Parse(w, this),
      )
      .extract("contents", (s) => Expression.Parse(s, this, [";"]))
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
    return [this.parent?.namespace, this.name].filter((r) => r).join("_");
  }

  possibleNames(name: string) {
    return [
      name,
      [this.namespace, name].join("_"),
      ...this.#entities.filter((e) => e instanceof EntityUse).map((e) => [e.namespace, name].join("_")),
    ];
  }

  find(name: string): Entry | undefined {
    for (const possible of this.possibleNames(name)) {
      const found = this.#entities.find((s) => s.fullName === possible);
      if (found) return found;
    }

    for (const possible of this.possibleNames(name)) {
      const found = super.find(name);
      if (found) return found;
    }
  }

  get type() {
    const result = this.#returns ?? this.#contents.resolution;
    if (this.#args.length)
      return new TypePipeable(
        this.location,
        this.done,
        this,
        this.#args.map((a) => a.typeArg),
        result,
      );

    return result;
  }

  async execute(closure: Closure, args: Frame): Promise<Variable> {
    closure = closure.withFrame(args);
    for (const entity of this.#entities) {
      if (entity instanceof EntityLet) {
        const c = closure.withVariable(entity.internalName, new VariablePipeable((a) => entity.execute(c, a), !entity.args.length));
        closure = c;
      } else if (entity instanceof EntityExternal) {
        const c = closure.withVariable(entity.internalName, new VariablePipeable((a) => entity.execute(c, a), false));
        closure = c;
      }
    }

    return this.#contents.resolve(closure);
  }
}
