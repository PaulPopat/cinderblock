import type { Shape } from "#writer";
import { LinkedTypePrimitiveMaths } from "./LinkedTypePrimitiveMaths.ts";

export class LinkedTypePrimitiveDouble extends LinkedTypePrimitiveMaths {
  get name() {
    return "double";
  }

  shape(): Shape {
    return { type: "double" };
  }
}
