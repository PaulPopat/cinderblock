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
  readonly #expecting: Array<TypeArg>;
  readonly #args: Array<TypeArg>;

  constructor(walker: TokenWalker, parent: () => Entry | undefined);
  constructor(existing: EntityStruct, args: Array<TypeArg>);
  constructor(...input: [walker: TokenWalker, parent: () => Entry | undefined] | [existing: EntityStruct, args: Array<TypeArg>]) {
    let walker: TokenWalker;
    let parent: () => Entry | undefined;
    let inputArgs: Array<TypeArg>;

    if (input[0] instanceof TokenWalker && typeof input[1] === "function") {
      [walker, parent] = input;
      inputArgs = [];
    } else {
      const [existing, i] = input as [existing: EntityStruct, args: Array<TypeArg>];
      inputArgs = i;
      walker = existing.#walker;
      parent = () => existing.parent;
    }

    const [{ name, args, extending, expecting }, done] = walker
      .expect("struct", TokenTypeName.KeyWord, () => this)
      .text("name", TokenTypeName.StructName, () => this)
      .if(
        (s) => s.data === "(",
        (s) =>
          s
            .while(
              "expecting",
              (s) => (s.data === "," || s.data === "(") && s.expect([",", "("], TokenTypeName.Punctuation).data !== ")",
              (s) => TypeArg.Parse(s.expect([",", "("], TokenTypeName.Punctuation), () => this),
            )
            .expect(")", TokenTypeName.Punctuation),
      )
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
    this.#expecting = [...inputArgs, ...(expecting?.filter((e) => !inputArgs.find((i) => i.name === e.name)) ?? [])];
    this.#args = args;
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

  type(args: Array<TypeArg>) {
    const subject = new EntityStruct(this, args);

    return new TypeTuple(subject.location, subject.done, () => subject, subject.#args, subject.#extending);
  }

  dig(name: string): Entry | undefined {
    if (name === this.name) return this;

    return undefined;
  }

  float(name: string): Entry | undefined {
    return this.#expecting.find((e) => e.name === name)?.type ?? this.parent?.float(name);
  }

  get model(): CreateFunc[] {
    return [];
  }
}
