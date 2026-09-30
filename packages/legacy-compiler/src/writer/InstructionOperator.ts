import type { Instruction } from "./Instruction.ts";

export type InstructionOperator = {
  type: "operator";
  operator:
    | "add"
    | "and"
    | "divide"
    | "equals"
    | "greater_than"
    | "greater_than_or_equal_to"
    | "in"
    | "less_than"
    | "less_than_or_equal_to"
    | "multiply"
    | "not_equals"
    | "or"
    | "partial_pipe"
    | "pipe"
    | "subtract";
  left: Instruction;
  right: Instruction;
};
