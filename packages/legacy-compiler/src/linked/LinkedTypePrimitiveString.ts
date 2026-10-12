import type { Shape } from "#writer";
import type { LinkedType } from "./LinkedType.ts";
import { LinkedTypePrimitive } from "./LinkedTypePrimitive.ts";

export class LinkedTypePrimitiveString extends LinkedTypePrimitive {
  get name() {
    return "string";
  }

  shape(): Shape {
    return { type: "string" };
  }

  compatible(input: LinkedType): boolean {
    return input instanceof LinkedTypePrimitiveString;
  }
}
