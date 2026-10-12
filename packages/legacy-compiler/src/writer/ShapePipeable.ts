import type { Shape } from "./Shape.ts";
import type { ShapeArg } from "./ShapeArg.ts";

export type ShapePipeable = { type: "pipeable"; args: Array<ShapeArg>; returns: Shape };
