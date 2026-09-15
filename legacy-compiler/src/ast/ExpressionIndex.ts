import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import { ParserError } from "./ParserError.ts";
import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import type { Type } from "./Type.ts";
import { TypeArray } from "./TypeArray.ts";

export class ExpressionIndex extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^@$/gm,
      inOne: true,
      factory: this,
    });
  }

  readonly #subject: Expression;
  readonly #key: Expression;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) throw new ParserError("Unexpected @", walker);

    const [{ key }, done] = walker
      .expect("@", TokenTypeName.Operator)
      .extract("key", (w) => Expression.ParseOne(w, () => this))
      .finish();
    super(walker.location, done, parent);
    this.#subject = existing;
    this.#key = key;
  }

  resolution(invocationType: TypeTuple): Type {
    let subjectType = this.#subject.resolution(invocationType);
    if (!(subjectType instanceof TypeArray)) {
      throw new LinkerError("Subject is not indexable", this.range);
    }

    return subjectType.contains;
  }

  instruction(invocationType: TypeTuple): Instruction {
    let subjectType = this.#subject.resolution(invocationType);
    if (!(subjectType instanceof TypeArray)) {
      throw new LinkerError("Subject is not indexable", this.range);
    }

    return {
      type: "index",
      subject: this.#subject.instruction(invocationType),
      index: this.#key.instruction(invocationType),
    };
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return this.#subject.funcs(invocationType);
  }
}
