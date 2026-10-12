import type { Shape } from "#writer";
import type { LinkedType } from "./LinkedType.ts";
import { LinkedTypePrimitive } from "./LinkedTypePrimitive.ts";

export class LinkedTypePrimitiveNull extends LinkedTypePrimitive {
  get name() {
    return "null";
  }

  shape(): Shape {
    return { type: "null" };
  }

  compatible(input: LinkedType): boolean {
    return input instanceof LinkedTypePrimitiveNull;
  }
}
