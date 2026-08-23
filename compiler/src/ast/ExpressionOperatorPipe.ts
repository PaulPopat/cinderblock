import { Frame, VariablePipeable, VariableTuple, type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "./TokenWalker.ts";
import { TypeArg } from "./TypeArg.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { TypeTuple } from "./TypeTuple.ts";

export class ExpressionOperatorPipe extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^->$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected ->", walker.store);
    const [{ right }, done] = walker
      .expect("->")
      .extract("right", (w) => Expression.ParseOne(w, () => this))
      .finish();
    super(walker.location, done, parent, existing, right);
  }

  get resolution() {
    const right = this.right.resolution;
    if (!(right instanceof TypePipeable)) {
      throw new LinkerError("Target not pipeable", this.location);
    }

    let input = this.left.resolution;
    if (!(input instanceof TypeTuple)) {
      input = new TypeTuple(this.location, this.done, () => this, [new TypeArg(this.location, this.done, () => this, input, "_s")]);
    }

    const remaining = right.args.filter((r) => !(input as TypeTuple).args.find((a) => a.name === r.name));

    if (!remaining.length) return right.returns;

    return new TypePipeable(this.location, this.done, () => this, remaining, right.returns);
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
      throw new LinkerError("Target not pipeable", this.location);
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
