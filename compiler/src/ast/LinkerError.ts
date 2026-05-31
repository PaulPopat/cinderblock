import type { Location } from "#utils";
import { CompilerError } from "../utils/CompilerError.ts";

export class LinkerError extends CompilerError {
  constructor(message: string, location: Location) {
    super(message, location);
  }
}
