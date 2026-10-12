import { LinkedEntry } from "./LinkedEntry.ts";
import type { Shape } from "#writer";

export abstract class LinkedType extends LinkedEntry {
  abstract shape(): Shape;
  abstract compatible(input: LinkedType): boolean;
}
