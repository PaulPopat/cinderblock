import type { Range } from "#utils";
import type { CreateFunc, Instruction } from "#writer";
import { LinkedExpression } from "./LinkedExpression.ts";
import type { LinkedExpressionLet } from "./LinkedExpressionLet.ts";
import { LinkedTypeUnion } from "./LinkedTypeUnion.ts";
import { WriterError } from "./WriterError.ts";

export class LinkedExpressionMatch extends LinkedExpression {
  readonly #subject: LinkedExpression;
  readonly #matchers: Array<LinkedExpressionLet>;

  constructor(range: Range, subject: LinkedExpression, matchers: Array<LinkedExpressionLet>) {
    super(range);
    this.#subject = subject;
    this.#matchers = matchers;
  }

  get resolution() {
    return new LinkedTypeUnion(
      this.range,
      this.#matchers.map((m) => m.resolution.returns),
    );
  }

  get instruction(): Instruction {
    return this.#matchers.reduce(
      (instruction, matcher): Instruction => {
        const type = matcher.args.find((a) => a.name === "_s")?.type;
        if (!type) {
          throw new WriterError("Subject required", matcher.range);
        }

        return {
          type: "ternary",
          predicate: {
            type: "is",
            left: this.#subject.instruction,
            right: type.shape(),
          },
          positive: {
            type: "operator",
            operator: "pipe",
            left: {
              type: "tuple",
              parts: [["_s", this.#subject.instruction]],
            },
            right: matcher.instruction,
          },
          negative: instruction,
        };
      },
      {
        type: "literal_null",
      } as Instruction,
    );
  }

  get funcs(): Array<CreateFunc> {
    return this.#matchers.flatMap((p) => p.funcs);
  }
}
