import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { TokenTypeName } from "#tokeniser";
import { ExpressionOperatorPipeBase } from "./ExpressionOperatorPipeBase.ts";

export class ExpressionOperatorPipe extends ExpressionOperatorPipeBase {
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

  get leftType() {
    const input = this.left.resolution;
    if (!(input instanceof TypeTuple)) {
      throw new LinkerError("Tuple required", this.range);
    }

    return input;
  }

  get leftInstructions() {
    return this.left.instruction;
  }
}
