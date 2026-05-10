import type { Location } from "#utils";
import type { Entry } from "./Entry.ts";

export type EntryContext = {
  start: Location;
  end: Location;
  entities: Array<Entry>;
};
