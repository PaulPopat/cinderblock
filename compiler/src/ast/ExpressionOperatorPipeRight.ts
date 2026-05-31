import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { TypeTuple } from "./TypeTuple.ts";

export class ExpressionOperatorPipeRight extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^<-$/gm,
      parse: (w, e) => {
        if (!e) throw new ParserError("Unexpected <-", w.store);
        return w
          .expect("<-")
          .extract("right", Expression.Parse)
          .finish(
            ({ right }, ctx) => new ExpressionOperatorPipeRight(ctx, e, right),
          );
      },
    });
  }

  get resolution() {
    if (!(this.right.resolution instanceof TypePipeable)) {
      throw new LinkerError("Target not pipeable", this.ctx.start);
    }

    const args =
      this.left.resolution instanceof TypeTuple
        ? this.left.resolution.args.map((a) => a.type)
        : [this.left.resolution];

    if (this.right.resolution.args.length === args.length)
      return this.right.resolution.returns;

    return new TypePipeable(
      this.ctx,
      this.right.resolution.args.slice(
        0,
        this.right.resolution.args.length - args.length,
      ),
      this.right.resolution.returns,
    );
  }
}
