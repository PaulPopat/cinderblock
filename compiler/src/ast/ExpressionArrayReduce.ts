import { EntityArg } from "./EntityArg.ts";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { ExpressionTuple } from "./ExpressionTuple.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { TypeArray } from "./TypeArray.ts";

export class ExpressionArrayReduce extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\|:$/gm,
      parse: (w, lookFor, e) => {
        if (!e) throw new ParserError("Unexpected |:", w.store);
        if (!(e instanceof ExpressionTuple))
          throw new LinkerError("Expected a tuple", w.location);
        if (e.entities.length !== 2)
          throw new LinkerError("Expected tuple length of 2", w.location);

        const [subject, initial] = e.entities;
        if (
          !(subject instanceof Expression) ||
          !(initial instanceof Expression)
        )
          throw new LinkerError("Expected tuple length of 2", w.location);

        const argType = subject.resolution;
        if (!(argType instanceof TypeArray))
          throw new LinkerError("May only map arrays", w.location);

        return w
          .expect("|:")
          .extract("current", (w, {}) =>
            w
              .text("name")
              .finish(
                ({ name }, ctx) => new EntityArg(ctx, initial.resolution, name),
              ),
          )
          .expect(",")
          .extract("as", (w, {}) =>
            w
              .text("name")
              .finish(({ name }, ctx) => new EntityArg(ctx, argType, name)),
          )
          .extract("routine", (w, { as, current }) =>
            Expression.Parse(w.withEntity(as).withEntity(current), lookFor),
          )
          .finish(
            ({ as, current, routine }, ctx) =>
              new ExpressionArrayReduce(
                ctx,
                subject,
                initial,
                as,
                current,
                routine,
              ),
          );
      },
    });
  }

  readonly #subject: Expression;
  readonly #initial: Expression;
  readonly #as: EntityArg;
  readonly #current: EntityArg;
  readonly #routine: Expression;

  constructor(
    ctx: EntryContext,
    subject: Expression,
    initial: Expression,
    as: EntityArg,
    current: EntityArg,
    routine: Expression,
  ) {
    super(ctx);
    this.#subject = subject;
    this.#initial = initial;
    this.#as = as;
    this.#current = current;
    this.#routine = routine;
  }

  get subject() {
    return this.#subject;
  }

  get initial() {
    return this.#initial;
  }

  get as() {
    return this.#as;
  }

  get current() {
    return this.#current;
  }

  get routine() {
    return this.#routine;
  }

  get resolution() {
    return this.#routine.resolution;
  }
}
