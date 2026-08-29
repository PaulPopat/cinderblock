import type { Instruction } from "./Instruction.ts";

export type InstructionAccess = {
  type: "access";
  subject: Instruction;
  key: string;
};
