import { Type } from "./Type.ts";

export abstract class TypePrimitive extends Type {
  abstract get name(): string;
}
