import type { Instruction } from "./Instruction.ts";

export type InstructionTernary = {
  type: "ternary";
  predicate: Instruction;
  positive: Instruction;
  negative: Instruction;
};
