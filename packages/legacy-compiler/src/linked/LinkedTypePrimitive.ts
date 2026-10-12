import { LinkedType } from "./LinkedType.ts";

export abstract class LinkedTypePrimitive extends LinkedType {
  abstract get name(): string;
}
