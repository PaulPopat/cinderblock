import { Frame, VariablePipeable, VariableTuple, type Closure, type Variable } from "#runner";
import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { TypeArg } from "./TypeArg.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { TypeTuple } from "./TypeTuple.ts";

export class ExpressionOperatorPipe extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^->$/gm,
      parse: (w, lookFor, e) => {
        if (!e) throw new ParserError("Unexpected ->", w.store);
        return w
          .expect("->")
          .extract("right", (w) => Expression.Parse(w, lookFor))
          .finish(({ right }, ctx) => new ExpressionOperatorPipe(ctx, e, right));
      },
    });
  }

  get resolution() {
    const right = this.right.resolution;
    if (!(right instanceof TypePipeable)) {
      throw new LinkerError("Target not pipeable", this.ctx.start);
    }

    let input = this.left.resolution;
    if (!(input instanceof TypeTuple)) {
      input = new TypeTuple(this.ctx, [new TypeArg(this.ctx, input, "_s")]);
    }

    const remaining = right.args.filter((r) => !(input as TypeTuple).args.find((a) => a.name === r.name));

    if (!remaining.length) return right.returns;

    return new TypePipeable(this.ctx, remaining, right.returns);
  }

  async resolve(closure: Closure): Promise<Variable> {
    let left = await this.left.resolve(closure);
    const right = await this.right.resolve(closure);

    if (!(left instanceof VariableTuple)) {
      left = new VariableTuple({ _s: left });
    }

    if (!(right instanceof VariablePipeable)) {
      throw new Error("Pipeable required");
    }

    const rightType = this.right.resolution;
    if (!(rightType instanceof TypePipeable)) {
      throw new LinkerError("Target not pipeable", this.ctx.start);
    }

    return right.execute(
      new Frame(
        (left as VariableTuple).entries.reduce(
          (frame, [key, value]) => ({
            ...frame,
            [key]: value,
          }),
          {} as Record<string, Variable>,
        ),
      ),
    );
  }
}
