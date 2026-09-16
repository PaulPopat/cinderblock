import { Type } from "./Type.ts";

export abstract class TypePrimitive extends Type {
  abstract get name(): string;

  get flattened() {
    return this;
  }

  representation(): string {
    return this.name;
  }
}
