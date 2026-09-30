import type { TokenWalker } from "#tokeniser";
import { CompilerError } from "../utils/CompilerError.ts";

export class ParserError extends CompilerError {
  constructor(message: string, walker: TokenWalker) {
    super(message, walker.range);
  }
}
