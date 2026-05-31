import { Arg } from "./Arg.ts";
import { Expression } from "./Expression.ts";
import { Entity } from "./Entity.ts";
import { Type } from "./Type.ts";
import type { EntryContext } from "./EntryContext.ts";
import { TypePipeable } from "./TypePipeable.ts";

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
                  (s) => Arg.Parse(s.next),
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

  readonly #name: string;
  readonly #args: Array<Arg>;
  readonly #returns: Type | undefined;
  readonly #contents: Expression;

  constructor(
    ctx: EntryContext,
    name: string,
    args: Array<Arg>,
    returns: Type | undefined,
    contents: Expression,
  ) {
    super(ctx);
    this.#name = name;
    this.#args = args;
    this.#returns = returns;
    this.#contents = contents;
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
      return new TypePipeable(this.ctx, this.#args, result);

    return result;
  }
}
