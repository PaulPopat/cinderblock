import type { VariableArray } from "./VariableArray.ts";
import type { VariablePipeable } from "./VariablePipeable.ts";
import type { VariablePrimitiveBool } from "./VariablePrimitiveBool.ts";
import type { VariablePrimitiveChar } from "./VariablePrimitiveChar.ts";
import type { VariablePrimitiveDouble } from "./VariablePrimitiveDouble.ts";
import type { VariablePrimitiveFloat } from "./VariablePrimitiveFloat.ts";
import type { VariablePrimitiveInt } from "./VariablePrimitiveInt.ts";
import type { VariablePrimitiveLong } from "./VariablePrimitiveLong.ts";
import type { VariablePrimitiveNull } from "./VariablePrimitiveNull.ts";
import type { VariablePrimitiveString } from "./VariablePrimitiveString.ts";
import type { VariableTuple } from "./VariableTuple.ts";

export type Variable =
  | VariableArray
  | VariablePipeable
  | VariablePrimitiveBool
  | VariablePrimitiveChar
  | VariablePrimitiveDouble
  | VariablePrimitiveFloat
  | VariablePrimitiveInt
  | VariablePrimitiveLong
  | VariablePrimitiveNull
  | VariablePrimitiveString
  | VariableTuple;
