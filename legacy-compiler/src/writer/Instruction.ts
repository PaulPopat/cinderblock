import type { InstructionAccess } from "./InstructionAccess.ts";
import type { InstructionArg } from "./InstructionArg.ts";
import type { InstructionArrayAdd } from "./InstructionArrayAdd.ts";
import type { InstructionExternal } from "./InstructionExternal.ts";
import type { InstructionLiteralArray } from "./InstructionLiteralArray.ts";
import type { InstructionLiteralBool } from "./InstructionLiteralBool.ts";
import type { InstructionLiteralChar } from "./InstructionLiteralChar.ts";
import type { InstructionLiteralDouble } from "./InstructionLiteralDouble.ts";
import type { InstructionLiteralFloat } from "./InstructionLiteralFloat.ts";
import type { InstructionLiteralInt } from "./InstructionLiteralInt.ts";
import type { InstructionLiteralLong } from "./InstructionLiteralLong.ts";
import type { InstructionLiteralNull } from "./InstructionLiteralNull.ts";
import type { InstructionLiteralString } from "./InstructionLiteralString.ts";
import type { InstructionNot } from "./InstructionNot.ts";
import type { InstructionOperator } from "./InstructionOperator.ts";
import type { InstructionReference } from "./InstructionReference.ts";
import type { InstructionTernary } from "./InstructionTernary.ts";
import type { InstructionTuple } from "./InstructionTuple.ts";

export type Instruction =
  | InstructionAccess
  | InstructionArg
  | InstructionArrayAdd
  | InstructionExternal
  | InstructionLiteralArray
  | InstructionLiteralBool
  | InstructionLiteralChar
  | InstructionLiteralDouble
  | InstructionLiteralFloat
  | InstructionLiteralInt
  | InstructionLiteralLong
  | InstructionLiteralNull
  | InstructionLiteralString
  | InstructionNot
  | InstructionOperator
  | InstructionReference
  | InstructionTernary
  | InstructionTuple;
