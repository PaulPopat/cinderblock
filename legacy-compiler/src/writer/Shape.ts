import type { ShapeArray } from "./ShapeArray.ts";
import type { ShapeBool } from "./ShapeBool.ts";
import type { ShapeChar } from "./ShapeChar.ts";
import type { ShapeDouble } from "./ShapeDouble.ts";
import type { ShapeFloat } from "./ShapeFloat.ts";
import type { ShapeInt } from "./ShapeInt.ts";
import type { ShapeLong } from "./ShapeLong.ts";
import type { ShapeNull } from "./ShapeNull.ts";
import type { ShapePipeable } from "./ShapePipeable.ts";
import type { ShapeString } from "./ShapeString.ts";
import type { ShapeTuple } from "./ShapeTuple.ts";
import type { ShapeUnknown } from "./ShapeUnknown.ts";

export type Shape =
  | ShapeArray
  | ShapeBool
  | ShapeChar
  | ShapeDouble
  | ShapeFloat
  | ShapeInt
  | ShapeLong
  | ShapePipeable
  | ShapeNull
  | ShapeString
  | ShapeTuple
  | ShapeUnknown;
