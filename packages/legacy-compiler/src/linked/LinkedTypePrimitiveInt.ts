import type { Shape } from "#writer";
import { LinkedTypePrimitiveMaths } from "./LinkedTypePrimitiveMaths.ts";

export class LinkedTypePrimitiveInt extends LinkedTypePrimitiveMaths {
  get name() {
    return "int";
  }

  shape(): Shape {
    return { type: "int" };
  }
}
