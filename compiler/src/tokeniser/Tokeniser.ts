import { Location } from "#utils";
import { Token } from "./Token.ts";

const allowedLiterals = ["[]", "[", "]", "(", ")", ":", "+", "++", "-", "/", "*", "!", "&&", "||", "==", "=", "!=", "<", "<=", ">", ">=", ".", "->"];

export class Tokeniser {
  readonly #file: string;
  readonly #text: string;

  readonly #patterns = [
    /^[a-zA-Z0-9_@$#]+$/gm,
    /^[0-9]+\.[0-9]*[a-z]?$/gm,
    ...allowedLiterals.map((a) => new RegExp(["^", ...[...a].map((c) => "\\" + c), "$"].join(""))),
    /^"[^"]*"?$/gm,
    /^'[^']?'?$/gm,
    /^'\\.?'?$/gm,
  ];

  constructor(file: string, text: string) {
    this.#file = file;
    this.#text = text;
  }

  #isValid(subject: string) {
    return !!this.#patterns.find((p) => subject.match(p)) && !subject.includes("\n");
  }

  get tokens() {
    const result: Array<Token> = [];
    const lines = this.#text.split("\n");

    let location = new Location(this.#file, 1, 1);
    let current = "";

    const finish = (lineNumber: number, characterNumber: number) => {
      const possible = new Token(current.trim(), location);
      current = "";
      location = new Location(this.#file, lineNumber + 1, characterNumber + 1);

      if (!possible.data) return;

      result.push(possible);
    };

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber]!;

      for (let characterNumber = 0; characterNumber < line.length; characterNumber++) {
        const character = line[characterNumber]!;

        if (this.#isValid(current + character)) {
          current += character;
        } else {
          finish(lineNumber, characterNumber);
          current = character;
        }
      }

      current += "\n";
    }

    finish(lines.length, 0);

    return result;
  }
}
