import type { Variable } from "./Variable.ts";

export type VariableTuple = {
  type: 10;
  data: Array<{ name: string; value: Variable }>;
};
