import type { Closure, Variable } from "#runner";
import { Entity } from "./Entity.ts";
import type { Type } from "./Type.ts";

export interface IEntityReferenceable extends Entity {
  get type(): Type;
  get internalName(): string;

  reference(closure: Closure): Promise<Variable>;
}
