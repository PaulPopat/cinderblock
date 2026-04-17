import { Location } from "./Location.ts";
import { Token } from "./Token.ts";
import { TokenStore } from "./TokenStore.ts";

export class Tokeniser {
  readonly #file: string;
  readonly #text: string;

  constructor(file: string, text: string) {
    this.#file = file;
    this.#text = text;
  }

  #isValid(subject: string) {
    return !!subject.match(/^([a-zA-Z0-9_@$#]+|[^\sa-zA-Z0-9]+)$/gm);
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

      for (
        let characterNumber = 0;
        characterNumber < line.length;
        characterNumber++
      ) {
        const character = line[characterNumber]!;

        if (this.#isValid(current + character)) {
          current += character;
        } else {
          finish(lineNumber, characterNumber);
          current = character;
        }
      }

      finish(lineNumber + 1, 0);
    }

    return TokenStore.start(result);
  }
}
