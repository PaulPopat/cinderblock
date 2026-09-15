import type { Shape } from "./Shape.ts";

export type ShapeUnion = { type: "union"; args: Array<Shape> };
