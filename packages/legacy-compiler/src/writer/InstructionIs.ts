import type { Instruction } from "./Instruction.ts";
import type { Shape } from "./Shape.ts";

export type InstructionIs= {
  type: "is";
  left: Instruction;
  right: Shape;
};
