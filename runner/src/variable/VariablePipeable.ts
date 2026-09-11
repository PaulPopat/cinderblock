import type { Variable } from "./Variable.ts";
import type { VariableTuple } from "./VariableTuple.ts";

export type VariablePipeable = {
  type: 1;
  data: (args: VariableTuple) => Variable;
};
