import type { Instruction } from "./Instruction.ts";

export type CreateFunc = {
  name: string;
  vars: Array<CreateFunc>;
  returns: Instruction;
  no_args: boolean;
};
