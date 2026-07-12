import { Binary, Instruction, Instructions } from "#binary";
import { Names } from "#utils";
import type { EntryContext } from "./EntryContext.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { TypeArray } from "./TypeArray.ts";
import { TypePipeable } from "./TypePipeable.ts";

export class ExpressionArrayFind extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\|!$/gm,
      parse: (w, lookFor, e) => {
        if (!e) throw new ParserError("Unexpected |!", w.store);
        const argType = e.resolution;
        if (!(argType instanceof TypeArray)) throw new LinkerError("May only find in arrays", w.location);
        return w
          .expect("|!")
          .extract("routine", (w) => Expression.Parse(w, lookFor))
          .finish(({ routine }, ctx) => new ExpressionArrayFind(ctx, e, routine));
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
    const subjectType = this.#subject.resolution;
    if (!(subjectType instanceof TypeArray)) throw new LinkerError("Array expected", this.ctx.start);

    const routineType = this.#routine.resolution;
    if (!(routineType instanceof TypePipeable)) throw new LinkerError("Expected a pipeable", this.ctx.start);

    return subjectType.contains;
  }

  instructions(binary: Binary) {
    let starter = Binary.Start;
    const matchGoTo = Instructions.Return();
    starter = starter.prefixed(matchGoTo);
    const failGoTo = Instructions.Pop();
    starter = starter.prefixed(failGoTo, Instructions.Return());

    const forEachGoTo = Instructions.CreateTuple();
    starter = starter.with(forEachGoTo, Instructions.AssignKey(Names.PropertyName("item")));
    starter = starter.including((b) => this.#routine.instructions(b));
    starter = starter.with(Instructions["->"](), Instructions["?:"](matchGoTo, failGoTo), Instructions.Return());

    return binary
      .with(Instructions.Empty())
      .including((b) => this.#subject.instructions(b))
      .with(Instructions.ForEach(forEachGoTo))
      .concat(starter);
  }
}
