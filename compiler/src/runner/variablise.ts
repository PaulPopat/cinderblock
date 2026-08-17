import type { Variable } from "./Variable.ts";
import { VariableArray } from "./VariableArray.ts";
import { VariablePipeable } from "./VariablePipeable.ts";
import { VariablePrimitiveBool } from "./VariablePrimitiveBool.ts";
import { VariablePrimitiveFloat } from "./VariablePrimitiveFloat.ts";
import { VariablePrimitiveInt } from "./VariablePrimitiveInt.ts";
import { VariablePrimitiveNull } from "./VariablePrimitiveNull.ts";
import { VariablePrimitiveString } from "./VariablePrimitiveString.ts";
import { VariableTuple } from "./VariableTuple.ts";

export function variablise(input: unknown): Variable {
  switch (typeof input) {
    case "bigint":
    case "symbol":
      throw new Error("Type unsupported");
    case "function":
      return new VariablePipeable((args) => variablise(input(args.export())));
    case "boolean":
      return new VariablePrimitiveBool(input);
    case "number":
      if (input % 1 === 0) return new VariablePrimitiveInt(input);
      return new VariablePrimitiveFloat(input);
    case "string":
      return new VariablePrimitiveString(input);
    case "undefined":
      return new VariablePrimitiveNull(null);
    case "object":
      if (!input) return new VariablePrimitiveNull(null);
      if (Array.isArray(input)) return new VariableArray(input.map((i) => variablise(i)));
      return new VariableTuple(Object.fromEntries(Object.entries(input).map(([key, value]) => [key, variablise(value)])));
  }
}
