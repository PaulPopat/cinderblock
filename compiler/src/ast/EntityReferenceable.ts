import { Entity } from "./Entity.ts";
import type { Type } from "./Type.ts";

export abstract class EntityReferenceable extends Entity {
  abstract get type(): Type;
  abstract get internalName(): string;
}
