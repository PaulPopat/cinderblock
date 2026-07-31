import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
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

    const input = this.left.resolution;
    if (!(input instanceof TypeTuple)) throw new LinkerError("Expected a tuple", this.ctx.start);

    const remaining = right.args.filter((r) => !input.args.find((a) => a.name === r.name));

    if (!remaining.length) return right.returns;

    return new TypePipeable(this.ctx, remaining, right.returns);
  }
}
