import { type Closure, type Variable } from "#runner";
import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { Type } from "./Type.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";

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

  get resolution() {
    return this.#right;
  }

  async resolve(closure: Closure): Promise<Variable> {
    return this.#left.resolve(closure);
  }

  get instruction(): Instruction {
    return this.#left.instruction;
  }
}
