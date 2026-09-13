import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypeArg } from "./TypeArg.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";

export class ExpressionOperatorPipe extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^->$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected ->", walker);
    const [{ right }, done] = walker
      .expect("->", TokenTypeName.Operator)
      .extract("right", (w) => Expression.ParseOne(w, () => this))
      .finish();
    super(walker.location, done, parent, existing, right);
  }

  get resolution() {
    const right = this.right.resolution;
    if (!(right instanceof TypePipeable)) {
      throw new LinkerError("Target not pipeable", this.range);
    }

    let input = this.left.resolution;
    if (!(input instanceof TypeTuple)) {
      input = new TypeTuple(this.location, this.done, () => this, [new TypeArg(this.location, this.done, () => this, input, "_s")]);
    }

    const remaining = right.args.filter((r) => !(input as TypeTuple).args.find((a) => a.name === r.name));

    if (!remaining.length) return right.returns;

    return new TypePipeable(this.location, this.done, () => this, remaining, right.returns);
  }

  get instruction(): Instruction {
    const right = this.right.resolution;
    if (!(right instanceof TypePipeable)) {
      throw new LinkerError("Target not pipeable", this.range);
    }

    let input = this.left.resolution;
    if (!(input instanceof TypeTuple)) {
      input = new TypeTuple(this.location, this.done, () => this, [new TypeArg(this.location, this.done, () => this, input, "_s")]);
    }

    const remaining = right.args.filter((r) => !(input as TypeTuple).args.find((a) => a.name === r.name));

    if (!remaining.length) {
      return {
        type: "operator",
        operator: "pipe",
        left: this.left.instruction,
        right: this.right.instruction,
      };
    }

    return {
      type: "operator",
      operator: "partial_pipe",
      left: this.left.instruction,
      right: this.right.instruction,
    };
  }
}
