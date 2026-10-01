import { ExpressionOperator } from "./ExpressionOperator.ts";
import { LinkerError } from "./LinkerError.ts";
import { TypePipeable } from "./TypePipeable.ts";
import { TypeTuple } from "./TypeTuple.ts";
import type { Instruction } from "#writer";
import type { Type } from "./Type.ts";
import type { TypeArg } from "./TypeArg.ts";
import { ExpressionReference } from "./ExpressionReference.ts";
import { EntityLet } from "./EntityLet.ts";

export abstract class ExpressionOperatorPipeBase extends ExpressionOperator {
  abstract get leftType(): TypeTuple;

  abstract get leftInstructions(): Instruction;

  rightType(args: Array<TypeArg>) {
    return this.right instanceof ExpressionReference
      ? this.right.subject instanceof EntityLet
        ? new EntityLet(this.right.subject, args).type
        : this.right.resolution
      : this.right.resolution;
  }

  get resolution(): Type {
    const input = this.leftType;
    const right = this.rightType(input.args);
    if (right instanceof TypePipeable) {
      const remaining = right.args.filter((r) => !(input as TypeTuple).args.find((a) => a.name === r.name));

      if (!remaining.length) return right.returns;

      return new TypePipeable(this.location, this.done, () => this, remaining, right.returns).flattened();
    }

    if (right instanceof TypeTuple) {
      return new TypeTuple(this.location, this.done, () => this, [
        ...input.args.filter((a) => !right.args.find((b) => b.name === a.name)),
        ...right.args,
      ]);
    }

    throw new LinkerError("Invalid maths", this.range);
  }

  get instruction(): Instruction {
    const input = this.leftType;
    const right = this.rightType(input.args);
    if (right instanceof TypePipeable) {
      for (const arg of input.args) {
        const match = right.args.find((a) => a.name === arg.name);
        if (!match) continue;

        if (!match.flattened().compatible(arg.flattened())) {
          throw new LinkerError(`Arg ${arg.name} is not compatible`, this.range);
        }
      }

      const remaining = right.args.filter((r) => !(input as TypeTuple).args.find((a) => a.name === r.name));

      if (!remaining.length) {
        return {
          type: "operator",
          operator: "pipe",
          left: this.leftInstructions,
          right: this.right.instruction,
        };
      }

      return {
        type: "operator",
        operator: "partial_pipe",
        left: this.leftInstructions,
        right: this.right.instruction,
      };
    }

    if (right instanceof TypeTuple) {
      return {
        type: "operator",
        operator: "pipe",
        left: this.leftInstructions,
        right: this.right.instruction,
      };
    }

    throw new LinkerError("Invalid maths", this.range);
  }
}
