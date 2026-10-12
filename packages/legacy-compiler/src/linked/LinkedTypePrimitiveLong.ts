import type { Shape } from "#writer";
import { LinkedTypePrimitiveMaths } from "./LinkedTypePrimitiveMaths.ts";

export class LinkedTypePrimitiveLong extends LinkedTypePrimitiveMaths {
  get name() {
    return "long";
  }

  shape(): Shape {
    return { type: "long" };
  }
}
