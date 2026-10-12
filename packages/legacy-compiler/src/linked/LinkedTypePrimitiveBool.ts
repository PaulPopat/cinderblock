import type { Shape } from "#writer";
import type { LinkedType } from "./LinkedType.ts";
import { LinkedTypePrimitive } from "./LinkedTypePrimitive.ts";

export class LinkedTypePrimitiveBool extends LinkedTypePrimitive {
  get name() {
    return "bool";
  }

  shape(): Shape {
    return { type: "bool" };
  }

  compatible(input: LinkedType): boolean {
    return input instanceof LinkedTypePrimitiveBool;
  }
}
