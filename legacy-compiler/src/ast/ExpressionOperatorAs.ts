import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { Type } from "./Type.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import type { TypeTuple } from "./TypeTuple.ts";

export class ExpressionOperatorAs extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^as$/gm,
      factory: this,
    });
  }

  readonly #left: Expression;
  readonly #right: Type;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected as", walker);
    const [{ right }, done] = walker
      .expect("as", TokenTypeName.Operator)
      .extract("right", (w) => Type.Parse(w, () => this))
      .finish();
    super(walker.location, done, parent);

    this.#left = existing;
    this.#right = right;
  }

  resolution(invocationType: TypeTuple): Type {
    return this.#right;
  }

  instruction(invocationType: TypeTuple): Instruction {
    return this.#left.instruction(invocationType);
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return this.#left.funcs(invocationType);
  }
}
