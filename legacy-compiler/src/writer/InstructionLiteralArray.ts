import type { Instruction } from "./Instruction.ts";

export type InstructionLiteralArray = {
  type: "literal_array";
  subject: Array<Instruction>;
};
