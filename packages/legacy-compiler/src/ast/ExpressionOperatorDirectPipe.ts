import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypeArg } from "./TypeArg.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";
import { ExpressionOperatorPipeBase } from "./ExpressionOperatorPipeBase.ts";
import { TypeTuple } from "./TypeTuple.ts";

export class ExpressionOperatorDirectPipe extends ExpressionOperatorPipeBase {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^-->$/gm,
      factory: this,
    });
  }

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected -->", walker);
    const [{ right }, done] = walker
      .expect("-->", TokenTypeName.Operator)
      .extract("right", (w) => Expression.ParseOne(w, () => this))
      .finish();
    super(walker.location, done, parent, existing, right);
  }

  get leftType() {
    return new TypeTuple(this.location, this.done, () => this, [new TypeArg(this.location, this.done, () => this, this.left.resolution, "_s")]);
  }

  get leftInstructions(): Instruction {
    return {
      type: "tuple",
      parts: [["_s", this.left.instruction]],
    };
  }
}
