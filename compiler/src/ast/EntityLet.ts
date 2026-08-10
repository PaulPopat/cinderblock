import { EntityArg } from "./EntityArg.ts";
import { Expression } from "./Expression.ts";
import { Entity } from "./Entity.ts";
import { Type } from "./Type.ts";
import type { EntryContext } from "./EntryContext.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { Namer, VariablePipeable, type Closure, type Frame, type Variable } from "#runner";

export class EntityLet extends Entity {
  static {
    Expression.RegisterEntity({
      priority: 100,
      match: /^let$/gm,
      parse: (w) =>
        w
          .expect("let")
          .text("name", "namespace")
          .if(
            (s) => s.data === "(",
            (walker) =>
              walker
                .expect("(")
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
          .extract("block", (s) => Expression.ParseBlock(s))
          .finish(
            ({ name, args, returns, block }, ctx) =>
              new EntityLet(ctx, [w.entryContext.namespace, name].filter((w) => w).join(":"), args ?? [], returns, block),
          ),
    });
  }

  readonly #name: string;
  readonly #args: Array<EntityArg>;
  readonly #returns: Type | undefined;
  readonly #contents: Expression;
  readonly #internalName = Namer.Next;

  constructor(ctx: EntryContext, name: string, args: Array<EntityArg>, returns: Type | undefined, contents: Expression) {
    super(ctx);
    this.#name = name;
    this.#args = args;
    this.#returns = returns;
    this.#contents = contents;
  }

  get name() {
    return this.#name;
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

  execute(closure: Closure, args: Frame): Variable {
    closure = closure.withFrame(args);
    for (const entity of this.#contents.entities) {
      if (!(entity instanceof EntityLet)) continue;

      const c = closure.withVariable(entity.internalName, new VariablePipeable((a) => entity.execute(c, a), !entity.args.length));
      closure = c;
    }

    return this.#contents.resolve(closure);
  }
}
