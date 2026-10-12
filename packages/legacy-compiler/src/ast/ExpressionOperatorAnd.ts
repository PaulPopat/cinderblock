import type { Entry } from "./Entry.ts";
import { Expression } from "./Expression.ts";
import { ExpressionOperator } from "./ExpressionOperator.ts";
import { ParserError } from "./ParserError.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import { TypePrimitiveBool } from "./TypePrimitiveBool.ts";
import { WriterError } from "../linked/WriterError.ts";
import { TokenTypeName } from "#tokeniser";
import type { Instruction } from "#writer";
import type { Type } from "./Type.ts";
import { _context } from "./EntryContext.ts";

export class ExpressionOperatorAnd extends ExpressionOperator {
  static {
    Expression.RegisterExpression({
      priority: 100,
      match: /^&&$/gm,
      factory: (walker, lookFor, existing) => {
        if (!existing) throw new ParserError("Unexpected &&", walker);
        const [{ right }, done] = walker
          .expect("&&", TokenTypeName.Operator)
          .extract("right", (w) => Expression.ParseOne(w))
          .finish();

        return new ExpressionOperatorAnd(_context(walker, done), existing, right);
      },
    });
  }
}
