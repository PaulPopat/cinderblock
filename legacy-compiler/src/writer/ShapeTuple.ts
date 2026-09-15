import type { Shape } from "./Shape.ts";

export type ShapeTuple = { type: "tuple"; args: Array<{ key: string; value: Shape }> };
