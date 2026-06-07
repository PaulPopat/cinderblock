export const PrimitiveKey = Object.freeze({
  Bool: 0x0,
  Char: 0x1,
  Double: 0x2,
  Float: 0x3,
  Int: 0x4,
  Long: 0x5,
  String: 0x6,
  Tuple: 0x7,
  Array: 0x8,
});

export type PrimitiveKey = (typeof PrimitiveKey)[keyof typeof PrimitiveKey];
