import type { Instruction } from "#writer";
import { LinkedExpressionOperator } from "./LinkedExpressionOperator.ts";
import { LinkedTypePipeable } from "./LinkedTypePipeable.ts";
import { LinkedTypeTuple } from "./LinkedTypeTuple.ts";
import { WriterError } from "./WriterError.ts";

export abstract class LinkedExpressionOperatorPipeBase extends LinkedExpressionOperator {
  get resolution() {
    const input = this.left.resolution;
    if (!(input instanceof LinkedTypeTuple)) {
      throw new WriterError("Tuple required", this.range);
    }

    const right = this.right.resolution;
    if (right instanceof LinkedTypePipeable) {
      const remaining = right.args.filter((r) => !input.args.find((a) => a.name === r.name));

      if (!remaining.length) return right.returns;

      return new LinkedTypePipeable(this.range, remaining, right.returns);
    }

    if (right instanceof LinkedTypeTuple) {
      return new LinkedTypeTuple(this.range, [...input.args.filter((a) => !right.args.find((b) => b.name === a.name)), ...right.args]);
    }

    throw new WriterError("Invalid maths", this.range);
  }

  get instruction(): Instruction {
    const input = this.left.resolution;
    if (!(input instanceof LinkedTypeTuple)) {
      throw new WriterError("Tuple required", this.range);
    }

    const right = this.right.resolution;
    if (right instanceof LinkedTypePipeable) {
      for (const arg of input.args) {
        const match = right.args.find((a) => a.name === arg.name);
        if (!match) continue;

        if (!match.compatible(arg)) {
          throw new WriterError(`Arg ${arg.name} is not compatible`, this.range);
        }
      }

      const remaining = right.args.filter((r) => !input.args.find((a) => a.name === r.name));

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

    if (right instanceof LinkedTypeTuple) {
      return {
        type: "operator",
        operator: "pipe",
        left: this.left.instruction,
        right: this.right.instruction,
      };
    }

    throw new WriterError("Invalid maths", this.range);
  }
}
