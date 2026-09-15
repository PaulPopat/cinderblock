import { TypeArg } from "./TypeArg.ts";
import { Entity } from "./Entity.ts";
import type { TokenWalker } from "../tokeniser/TokenWalker.ts";
import type { Entry } from "./Entry.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc } from "#writer";
import { TypeReference } from "./TypeReference.ts";

export class EntityStruct extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^struct$/gm,
      factory: EntityStruct,
    });
  }

  readonly #name: string;
  readonly #extending: Array<TypeReference>;
  readonly #args: Array<TypeArg>;

  constructor(walker: TokenWalker, parent: () => Entry | undefined) {
    const [{ name, args, extending }, done] = walker
      .expect("struct", TokenTypeName.KeyWord, () => this)
      .text("name", TokenTypeName.StructName, () => this)
      .if(
        (s) => s.data === ":",
        (w) =>
          w.while(
            "extending",
            (s) => s.data === ":" || s.data === ",",
            (s) => TypeReference.ParseReference(s.expect([":", ","], TokenTypeName.Operator), () => this),
          ),
      )
      .while(
        "args",
        (s) => s.data !== ";",
        (s) => TypeArg.Parse(s, () => this),
      )
      .expect(";", TokenTypeName.Punctuation)
      .finish();
    super(walker.location, done, parent);
    this.#name = name;
    this.#extending = extending ?? [];
    this.#args = args;
  }

  get name() {
    return this.#name;
  }

  get args() {
    return [...this.#args, ...this.#extending.flatMap((e) => e.struct.#args)];
  }

  get fullName() {
    return this.#name;
  }

  dig(name: string): Entry | undefined {
    if (name === this.name) return this;

    return undefined;
  }

  float(name: string): Entry | undefined {
    return this.parent?.float(name);
  }

  model(): CreateFunc[] {
    return [];
  }
}
