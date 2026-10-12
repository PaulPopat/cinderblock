import type { LinkedType } from "./LinkedType.ts";
import { LinkedTypePrimitive } from "./LinkedTypePrimitive.ts";

export abstract class LinkedTypePrimitiveMaths extends LinkedTypePrimitive {
  compatible(input: LinkedType): boolean {
    return input instanceof LinkedTypePrimitiveMaths;
  }
}
