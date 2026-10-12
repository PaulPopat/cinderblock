import type { Shape } from "#writer";
import { LinkedTypePrimitiveMaths } from "./LinkedTypePrimitiveMaths.ts";

export class LinkedTypePrimitiveFloat extends LinkedTypePrimitiveMaths {
  get name() {
    return "float";
  }

  shape(): Shape {
    return { type: "float" };
  }
}
