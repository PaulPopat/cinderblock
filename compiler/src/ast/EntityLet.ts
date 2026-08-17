import { EntityArg } from "./EntityArg.ts";
import { Expression } from "./Expression.ts";
import { Entity } from "./Entity.ts";
import { Type } from "./Type.ts";
import type { EntryContext } from "./EntryContext.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { Closure, Namer, VariablePipeable, type Frame, type Variable } from "#runner";
import { EntryTag } from "./EntryTag.ts";
import { EntityExternal } from "./EntityExternal.ts";

export class EntityLet extends Entity {
  static {
    Expression.RegisterEntity({
      priority: 100,
      match: /^let$/gm,
      parse: (w) =>
        w
          .expect("let")
          .if(
            (s) => s.data === "[",
            (s) =>
              s
                .while(
                  "tags",
                  (s) => s.data === "[" || s.data === ",",
                  (s) =>
                    s.next
                      .text("key")
                      .expect("=")
                      .text("value")
                      .finish(({ key, value }, ctx) => new EntryTag(ctx, key, JSON.parse(value))),
                )
                .expect("]"),
          )
          .text("name", "namespace")
          .if(
            (s) => s.data === "(",
            (walker) =>
              walker
                .while(
                  "args",
                  (s) => s.data === "," || s.data === "(",
                  (s) => EntityArg.Parse(s.next),
                  "entity",
                )
                .expect(")"),
          )
          .if(
            (s) => s.data === ":",
            (walker) => walker.expect(":").extract("returns", (s) => Type.Parse(s)),
          )
          .expect("=")
          .extract("block", (s) => Expression.ParseBlock(s))
          .finish(
            ({ name, args, returns, block, tags }, ctx) =>
              new EntityLet(ctx, [w.entryContext.namespace, name].filter((w) => w).join("_"), tags ?? [], args ?? [], returns, block),
          ),
    });
  }

  readonly #name: string;
  readonly #tags: Array<EntryTag>;
  readonly #args: Array<EntityArg>;
  readonly #returns: Type | undefined;
  readonly #contents: Expression;
  readonly #internalName = Namer.Next;

  constructor(ctx: EntryContext, name: string, tags: Array<EntryTag>, args: Array<EntityArg>, returns: Type | undefined, contents: Expression) {
    super(ctx);
    this.#name = name;
    this.#tags = tags;
    this.#args = args;
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
    return this.#name;
  }

  get type() {
    const result = this.#returns ?? this.#contents.resolution;
    if (this.#args.length)
      return new TypePipeable(
        this.ctx,
        this.#args.map((a) => a.typeArg),
        result,
      );

    return result;
  }

  async execute(closure: Closure, args: Frame): Promise<Variable> {
    closure = closure.withFrame(args);
    for (const entity of this.#contents.entities) {
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
