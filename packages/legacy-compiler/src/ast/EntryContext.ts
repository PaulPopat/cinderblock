import { TokenWalker } from "#tokeniser";
import { Location } from "#utils";

export type EntryContext = {
  location: Location;
  done: TokenWalker;
};

export function _context(start: TokenWalker, done: TokenWalker): EntryContext {
  return {
    location: start.location,
    done,
  };
}

export function _empty(): EntryContext {
  return { location: Location.empty, done: TokenWalker.empty };
}
