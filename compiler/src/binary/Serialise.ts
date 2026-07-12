import type { Type } from "#ast";

export const Serialise = Object.freeze({
  Bool: (input: boolean) => new Uint8Array([input ? 1 : 0]),
  Char: (input: string) => new Uint8Array([input.charCodeAt(0)]),
  Double: (input: string) => new Uint8Array(),
  Float: (input: string) => new Uint8Array(),
  Int: (input: string) => new Uint8Array(),
  Long: (input: string) => new Uint8Array(),
  String: (input: string) => new Uint8Array(),
  Type: (input: Type) => new Uint8Array(),
});
