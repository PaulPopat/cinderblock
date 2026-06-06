import { EntityArg } from "./EntityArg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { TypeArray } from "./TypeArray.ts";

export class ExpressionMap extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\|>$/gm,
      parse: (w, lookFor, e) => {
        if (!e) throw new ParserError("Unexpected |>", w.store);
        const argType = e.resolution;
        if (!(argType instanceof TypeArray))
          throw new LinkerError("May only map arrays", w.location);
        return w
          .expect("|>")
          .extract("as", (w, {}) =>
            w
              .text("name")
              .finish(({ name }, ctx) => new EntityArg(ctx, argType, name)),
          )
          .extract("routine", (w, { as }) =>
            Expression.Parse(w.withEntity(as), lookFor),
          )
          .finish(
            ({ as, routine }, ctx) => new ExpressionMap(ctx, e, as, routine),
          );
      },
    });
  }

  readonly #subject: Expression;
  readonly #as: EntityArg;
  readonly #routine: Expression;

  constructor(
    ctx: EntryContext,
    subject: Expression,
    as: EntityArg,
    routine: Expression,
  ) {
    super(ctx);
    this.#subject = subject;
    this.#as = as;
    this.#routine = routine;
  }

  get subject() {
    return this.#subject;
  }

  get as() {
    return this.#as;
  }

  get routine() {
    return this.#routine;
  }

  get resolution() {
    return new TypeArray(this.ctx, this.#routine.resolution);
  }
}
