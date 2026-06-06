import { EntityArg } from "./EntityArg.ts";
import { Expression } from "./Expression.ts";
import { Entity } from "./Entity.ts";
import { Type } from "./Type.ts";
import type { EntryContext } from "./EntryContext.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { Names } from "../utils/index.ts";

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
            (walker) =>
              walker.expect(":").extract("returns", (s) => Type.Parse(s)),
          )
          .extract("block", (s) => Expression.Parse(s))
          .finish(
            ({ name, args, returns, block }, ctx) =>
              new EntityLet(ctx, name, args ?? [], returns, block),
          ),
    });
  }

  readonly #id = Names.Next;
  readonly #name: string;
  readonly #args: Array<EntityArg>;
  readonly #returns: Type | undefined;
  readonly #contents: Expression;

  constructor(
    ctx: EntryContext,
    name: string,
    args: Array<EntityArg>,
    returns: Type | undefined,
    contents: Expression,
  ) {
    super(ctx);
    this.#name = name;
    this.#args = args;
    this.#returns = returns;
    this.#contents = contents;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
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
    return [this.ctx.namespace, this.#name].join(":");
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
}
