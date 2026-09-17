import { TypeArg } from "./TypeArg.ts";
import { Entity } from "./Entity.ts";
import { TokenWalker } from "../tokeniser/TokenWalker.ts";
import type { Entry } from "./Entry.ts";
import { TokenTypeName } from "#tokeniser";
import type { CreateFunc } from "#writer";
import { TypeReference } from "./TypeReference.ts";
import { TypeTuple } from "./TypeTuple.ts";
import { LinkerError } from "./LinkerError.ts";

export class EntityStruct extends Entity {
  static {
    Entity.RegisterEntity({
      priority: 100,
      match: /^struct$/gm,
      factory: EntityStruct,
    });
  }

  readonly #walker: TokenWalker;
  readonly #name: string;
  readonly #extending: Array<TypeReference>;
  readonly #args: Array<TypeArg>;
  readonly #generics: Array<TypeArg>;

  constructor(walker: TokenWalker, parent: () => Entry | undefined);
  constructor(base: EntityStruct, generics: Array<TypeArg>);
  constructor(...input: [TokenWalker, parent: () => Entry | undefined] | [base: EntityStruct, generics: Array<TypeArg>]) {
    let generics: Array<TypeArg>;
    let walker: TokenWalker;
    let parent: () => Entry | undefined;

    if (input[0] instanceof TokenWalker) {
      [walker, parent] = input as [TokenWalker, parent: () => Entry | undefined];
      generics = [];
    } else {
      const [base, gen] = input as [base: EntityStruct, generics: Array<TypeArg>];
      walker = base.#walker;
      generics = gen;
      parent = () => base.parent;
    }

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
    this.#walker = walker;
    this.#name = name;
    this.#extending = extending ?? [];
    this.#args = args;
    this.#generics = generics;
  }

  get name() {
    return this.#name;
  }

  get args() {
    return [
      ...this.#args,
      ...this.#extending.flatMap((e) => {
        const found = e.flattened();
        if (found instanceof TypeTuple) return found.args;
        throw new LinkerError("Tuple required", e.range);
      }),
    ];
  }

  get fullName() {
    return this.#name;
  }

  get type() {
    return new TypeTuple(this.location, this.done, () => this.parent, this.#args, this.#extending);
  }

  dig(name: string): Entry | undefined {
    if (name === this.name) return this;

    return undefined;
  }

  float(name: string): Entry | undefined {
    return this.#generics.reduce((result, arg) => result ?? arg.dig(name), undefined as Entry | undefined) ?? this.parent?.float(name);
  }

  get model(): CreateFunc[] {
    return [];
  }
}
