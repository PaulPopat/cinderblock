import { Frame } from "./Frame.ts";
import { variablise } from "./variablise.ts";

export function framise(input: Record<string, unknown>) {
  return new Frame(Object.fromEntries(Object.entries(input).map(([key, value]) => [key, variablise(value)])));
}
