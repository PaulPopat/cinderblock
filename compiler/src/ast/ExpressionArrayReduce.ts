import { Names } from "#utils";
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

        return w
          .expect("|:")
          .extract("routine", (w) => Expression.Parse(w, lookFor))
          .finish(({ routine }, ctx) => new ExpressionArrayReduce(ctx, e, routine));
      },
    });
  }

  readonly #subject: Expression;
  readonly #routine: Expression;

  constructor(ctx: EntryContext, subject: Expression, routine: Expression) {
    super(ctx);
    this.#subject = subject;
    this.#routine = routine;
  }

  get subject() {
    return this.#subject;
  }

  get routine() {
    return this.#routine;
  }

  get resolution() {
    if (!(this.#subject instanceof ExpressionTuple)) throw new LinkerError("Expected a tuple", this.ctx.start);
    const input = this.#subject.partOf("input");
    if (!input) throw new LinkerError("Must have a input property", this.ctx.start);
    const initial = this.#subject.partOf("initial");
    if (!initial) throw new LinkerError("Must have a initial property", this.ctx.start);

    const argType = input.resolution;
    if (!(argType instanceof TypeArray)) throw new LinkerError("May only map arrays", this.ctx.start);

    return initial.resolution;
  }
}
