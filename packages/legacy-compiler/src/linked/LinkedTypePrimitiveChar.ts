import type { Shape } from "#writer";
import { LinkedTypePrimitiveMaths } from "./LinkedTypePrimitiveMaths.ts";

export class LinkedTypePrimitiveChar extends LinkedTypePrimitiveMaths {
  get name() {
    return "char";
  }

  shape(): Shape {
    return { type: "char" };
  }
}
