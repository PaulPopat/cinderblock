import type { Shape } from "#writer";
import type { LinkedType } from "./LinkedType.ts";
import { LinkedTypePrimitive } from "./LinkedTypePrimitive.ts";

export class LinkedTypePrimitiveUnknown extends LinkedTypePrimitive {
  get name() {
    return "unknown";
  }

  shape(): Shape {
    return { type: "unknown" };
  }

  compatible(input: LinkedType): boolean {
    return true;
  }
}
