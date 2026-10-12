import type { Shape } from "./Shape.ts";

export type ShapeArg = {
  type: "arg";
  name: string;
  value: Shape;
};
