import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { LinkerError } from "./LinkerError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import type { Type } from "./Type.ts";
import type { TypeTuple } from "./TypeTuple.ts";

export class ExpressionNot extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\!$/gm,
      inOne: false,
      factory: this,
    });
  }

  readonly #subject: Expression;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    const [{ subject }, done] = walker
      .expect("!", TokenTypeName.Operator)
      .extract("subject", (w) => Expression.ParseOne(w, () => this))
      .finish();
    super(walker.location, done, parent);
    this.#subject = subject;
  }

  get subject() {
    return this.#subject;
  }

  resolution(invocationType: TypeTuple): Type {
    let subjectType = this.#subject.resolution(invocationType);
    if (!(subjectType instanceof TypePrimitiveBool)) {
      throw new LinkerError("Boolean required", this.range);
    }

    return new TypePrimitiveBool(this.location, this.done, () => this);
  }

  instruction(invocationType: TypeTuple): Instruction {
    if (!(this.#subject.resolution(invocationType) instanceof TypePrimitiveBool)) {
      throw new LinkerError("Boolean required", this.range);
    }

    return { type: "not", subject: this.#subject.instruction(invocationType) };
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return [...this.#subject.funcs(invocationType)];
  }
}
