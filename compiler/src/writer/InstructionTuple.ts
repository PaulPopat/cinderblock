import type { Instruction } from "./Instruction.ts";

export type InstructionTuple = {
  type: "tuple";
  parts: Array<[string, Instruction]>;
};
