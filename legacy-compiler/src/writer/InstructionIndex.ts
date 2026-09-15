import type { Instruction } from "./Instruction.ts";

export type InstructionIndex = {
  type: "index";
  index: Instruction;
  subject: Instruction;
};
