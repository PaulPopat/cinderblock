import { Binary, Instructions } from "#binary";
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

  instructions(binary: Binary) {
    let starter = Binary.Start;

    const forEachGoTo = Instructions.CreateTuple();
    starter = starter.with(forEachGoTo, Instructions.AssignKey(Names.PropertyName("item")));
    starter = starter.with(forEachGoTo, Instructions.AssignKey(Names.PropertyName("current")));
    starter = starter.including((b) => this.#routine.instructions(b));
    starter = starter.with(Instructions["->"](), Instructions.Return());

    return binary
      .including((b) => this.#subject.instructions(b))
      .with(Instructions["."](Names.PropertyName("initial")))
      .with(Instructions["."](Names.PropertyName("input")))
      .with(Instructions.ForEach(forEachGoTo))
      .with(Instructions.Pop())
      .concat(starter);
  }
}
