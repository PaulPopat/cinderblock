import type { Instruction } from "./Instruction.ts";

export type InstructionArrayAdd = {
  type: "array_add";
  left: Instruction;
  right: Instruction;
};
