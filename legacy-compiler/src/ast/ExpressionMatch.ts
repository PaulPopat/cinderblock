import { TypeArg } from "./TypeArg.ts";
import { Expression } from "./Expression.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { ExpressionTuplePart } from "./ExpressionTuplePart.ts";
import type { Entry } from "./Entry.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc, Instruction } from "#writer";
import { ExpressionTupleSpread } from "./ExpressionTupleSpread.ts";
import { LinkerError } from "./LinkerError.ts";
import { TypeReference } from "./TypeReference.ts";
import type { Type } from "./Type.ts";
import { ParserError } from "./ParserError.ts";
import { ExpressionFunc } from "./ExpressionFunc.ts";
import { TypeUnion } from "./TypeUnion.ts";

export class ExpressionMatch extends Expression {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^\|$/gm,
      factory: this,
    });
  }

  readonly #subject: Expression;
  readonly #matchers: Array<ExpressionFunc>;

  constructor(walker: TokenWalker, parent: () => Entry | undefined, lookFor: Array<string>, existing: Expression | undefined) {
    if (!existing) {
      throw new ParserError("Unexpected |", walker);
    }

    const [{ matchers }, done] = walker
      .expect("|", TokenTypeName.Punctuation)
      .while(
        "matchers",
        (w) => w.data === "let",
        (s) => new ExpressionFunc(s, () => this, lookFor, undefined),
      )
      .finish();
    super(walker.location, done, parent);
    this.#subject = existing;
    this.#matchers = matchers;
  }

  resolution(invocationType: TypeTuple): Type {
    return new TypeUnion(
      this.location,
      this.done,
      () => this,
      this.#matchers.map((m) => m.resolution(invocationType).returns),
    );
  }

  instruction(invocationType: TypeTuple): Instruction {
    return this.#matchers.reduce(
      (instruction, matcher): Instruction => {
        const type = matcher.args.find((a) => a.name === "_s")?.type(TypeTuple.empty);
        if (!type) {
          throw new LinkerError("Subject required", matcher.range);
        }

        return {
          type: "ternary",
          predicate: {
            type: "is",
            left: this.#subject.instruction(invocationType),
            right: type.shape(),
          },
          positive: {
            type: "operator",
            operator: "pipe",
            left: {
              type: "tuple",
              parts: [["_s", this.#subject.instruction(invocationType)]],
            },
            right: matcher.instruction(TypeTuple.empty),
          },
          negative: instruction,
        };
      },
      {
        type: "literal_null",
      } as Instruction,
    );
  }

  funcs(invocationType: TypeTuple): Array<CreateFunc> {
    return this.#matchers.flatMap((p) => p.funcs(invocationType));
  }
}
