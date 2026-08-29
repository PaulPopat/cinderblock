import type { Instruction } from "./Instruction.ts";

export type InstructionNot = {
  type: "not";
  subject: Instruction;
};
