export { Sequence as Array } from "./data-types/array.ts";
export { ASCII } from "./data-types/ascii.ts";
export { Bool } from "./data-types/bool.ts";
export { Char } from "./data-types/char.ts";
export { Double } from "./data-types/double.ts";
export { Float } from "./data-types/float.ts";
export { Int } from "./data-types/int.ts";
export { Long } from "./data-types/long.ts";
export { Short } from "./data-types/short.ts";
export { Struct } from "./data-types/struct.ts";
export { UChar } from "./data-types/u-char.ts";
export { UInt } from "./data-types/u-int.ts";
export { ULong } from "./data-types/u-long.ts";
export { UShort } from "./data-types/u-short.ts";
export { UTF8 } from "./data-types/utf-8.ts";
export { Empty } from "./data-types/empty.ts";
export { DateTime } from "./data-types/date-time.ts";
export { Union } from "./data-types/union.ts";
export { Intersection } from "./data-types/intersection.ts";
export { Literal } from "./data-types/literal.ts";
export { Record } from "./data-types/record.ts";
export { Buffer } from "./data-types/buffer.ts";
export { Guid } from "./data-types/guid.ts";
export { Optional } from "./data-types/optional.ts";
export { Enum } from "./data-types/enum.ts";
export type { default as ISerialiseable } from "./data-types/base.ts";

import { BufferReader, BufferWriter } from "./data-types/buffer-extra.ts";
import type ISerialiseable from "./data-types/base.ts";

export type Serialised<T> = T extends ISerialiseable<infer A> ? A : never;

export function Write<TSchema>(
  schema: ISerialiseable<TSchema>,
  input: TSchema
) {
  const writer = new BufferWriter();

  if (!schema.Confirm(input))
    throw new Error("Attempting to serialise invalid type");

  schema.Impart(input, writer);

  return writer.Buffer;
}

export function Read<TSchema>(
  schema: ISerialiseable<TSchema>,
  buffer: ArrayBuffer
) {
  const reader = new BufferReader(buffer);

  return schema.Accept(reader);
}

export { BufferReader, BufferWriter };
