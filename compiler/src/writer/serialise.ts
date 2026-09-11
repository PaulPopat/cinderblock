import type { CreateFunc } from "./CreateFunc.ts";
import type { Instruction } from "./Instruction.ts";
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
import type { InstructionLiteralNull } from "./InstructionLiteralNull.ts";
import type { InstructionLiteralString } from "./InstructionLiteralString.ts";
import type { InstructionNot } from "./InstructionNot.ts";
import type { InstructionOperator } from "./InstructionOperator.ts";
import type { InstructionReference } from "./InstructionReference.ts";
import type { InstructionTernary } from "./InstructionTernary.ts";
import type { InstructionTuple } from "./InstructionTuple.ts";

function makeString(data: string) {
  return Buffer.concat([Buffer.from(data, "utf8"), new Uint8Array([0])]);
}

function serialiseAccess(data: InstructionAccess): Buffer {
  return Buffer.concat([new Uint8Array([0]), serialise(data.subject), makeString(data.key)]);
}

function serialiseArg(data: InstructionArg): Buffer {
  return Buffer.concat([new Uint8Array([1]), makeString(data.name)]);
}

function serialiseArrayAdd(data: InstructionArrayAdd): Buffer {
  return Buffer.concat([new Uint8Array([2]), serialise(data.left), serialise(data.right)]);
}

function serialiseExternal(data: InstructionExternal): Buffer {
  return Buffer.concat([new Uint8Array([3]), makeString(data.name)]);
}

function serialiseLiteralArray(data: InstructionLiteralArray): Buffer {
  return Buffer.concat([new Uint8Array([4]), ...data.subject.flatMap((value) => [new Uint8Array([1]), serialise(value)]), new Uint8Array([0])]);
}

function serialiseLiteralBool(data: InstructionLiteralBool): Buffer {
  return Buffer.concat([new Uint8Array([5]), new Uint8Array(data.value ? 1 : 0)]);
}

function serialiseLiteralChar(data: InstructionLiteralChar): Buffer {
  return Buffer.concat([new Uint8Array([6]), new Uint8Array([data.value])]);
}

function serialiseLiteralDouble(data: InstructionLiteralDouble): Buffer {
  throw new Error("Double is not supported whilst compiler is not native");
}

function serialiseLiteralFloat(data: InstructionLiteralFloat): Buffer {
  const result = Buffer.from(new Uint8Array(4));
  result.writeFloatLE(data.value, 0);
  return Buffer.concat([new Uint8Array([8]), new Uint8Array([data.value])]);
}

function serialiseLiteralInt(data: InstructionLiteralInt): Buffer {
  const result = Buffer.from(new Uint8Array(4));
  result.writeInt32LE(data.value, 0);
  return Buffer.concat([new Uint8Array([9]), new Uint8Array([data.value])]);
}

function serialiseLiteralLong(data: InstructionLiteralInt): Buffer {
  const result = Buffer.from(new Uint8Array(8));
  result.writeBigInt64LE(BigInt(data.value), 0);
  return Buffer.concat([new Uint8Array([10]), new Uint8Array([data.value])]);
}

function serialiseLiteralNull(data: InstructionLiteralNull): Buffer {
  return Buffer.from(new Uint8Array([11]));
}

function serialiseLiteralString(data: InstructionLiteralString): Buffer {
  return Buffer.concat([new Uint8Array([12]), makeString(data.value)]);
}

function serialiseNot(data: InstructionNot): Buffer {
  return Buffer.concat([new Uint8Array([13]), serialise(data.subject)]);
}

const operators = Object.freeze({
  add: 0,
  and: 1,
  divide: 2,
  equals: 3,
  greater_than: 4,
  greater_than_or_equal_to: 5,
  in: 6,
  less_than: 7,
  less_than_or_equal_to: 8,
  multiply: 9,
  not_equals: 10,
  or: 11,
  partial_pipe: 12,
  pipe: 13,
  subtract: 14,
  modulo: 15,
});

function serialiseOperator(data: InstructionOperator): Buffer {
  return Buffer.concat([new Uint8Array([14]), new Uint8Array(operators[data.operator]), serialise(data.left), serialise(data.right)]);
}

function serialiseReference(data: InstructionReference): Buffer {
  return Buffer.concat([new Uint8Array([15]), makeString(data.name)]);
}

function serialiseTernary(data: InstructionTernary): Buffer {
  return Buffer.concat([new Uint8Array([16]), serialise(data.predicate), serialise(data.positive), serialise(data.negative)]);
}

function serialiseTuple(data: InstructionTuple): Buffer {
  return Buffer.concat([new Uint8Array([17]), ...data.parts.flatMap(([name, inst]) => [makeString(name), serialise(inst)])]);
}

const serialisers = Object.freeze({
  access: serialiseAccess,
  arg: serialiseArg,
  array_add: serialiseArrayAdd,
  external: serialiseExternal,
  literal_array: serialiseLiteralArray,
  literal_bool: serialiseLiteralBool,
  literal_char: serialiseLiteralChar,
  literal_double: serialiseLiteralDouble,
  literal_float: serialiseLiteralFloat,
  literal_int: serialiseLiteralInt,
  literal_long: serialiseLiteralLong,
  literal_null: serialiseLiteralNull,
  literal_string: serialiseLiteralString,
  not: serialiseNot,
  operator: serialiseOperator,
  reference: serialiseReference,
  ternary: serialiseTernary,
  tuple: serialiseTuple,
});

function serialise(data: Instruction): Buffer {
  return serialisers[data.type](data as any);
}

export function serialiseApp(data: Array<CreateFunc>): Buffer {
  return Buffer.concat([
    ...data.flatMap((func) => [
      new Uint8Array([1]),
      makeString(func.name),
      new Uint8Array([func.no_args ? 1 : 0]),
      serialiseApp(func.vars),
      serialise(func.returns),
    ]),
    new Uint8Array([0]),
  ]);
}
