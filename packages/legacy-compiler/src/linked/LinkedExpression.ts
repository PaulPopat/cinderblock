import { LinkedEntry } from "./LinkedEntry.ts";
import type { LinkedType } from "./LinkedType.ts";
import type { CreateFunc, Instruction } from "#writer";

export abstract class LinkedExpression extends LinkedEntry {
  abstract get resolution(): LinkedType;
  abstract get instruction(): Instruction;
  abstract get funcs(): Array<CreateFunc>;
}
