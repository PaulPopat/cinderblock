import type { Frame } from "./Frame.ts";
import type { Variable } from "./Variable.ts";

export class Closure {
  readonly #globals: Frame;
  readonly #frames: Array<Frame>;

  constructor(globals: Frame, frames: Array<Frame>) {
    this.#globals = globals;
    this.#frames = frames;
  }

  search(name: string) {
    for (const frame of this.#frames) {
      const possible = frame.search(name);
      if (possible) return possible;
    }

    throw new Error(`Variable  not resolved`);
  }

  withFrame(frame: Frame) {
    return new Closure(this.#globals, [...this.#frames, frame]);
  }

  withVariable(name: string, value: Variable | Promise<Variable>) {
    const frame = this.#frames[this.#frames.length - 1];
    if (!frame) throw new Error("Not within a frame");
    return new Closure(this.#globals, [...this.#frames.filter((f) => f !== frame), frame.withVariable(name, value)]);
  }

  searchGlobal(name: string) {
    const possible = this.#globals.search(name);
    if (!possible) throw new Error(`Could not find external ${name}`);

    return possible;
  }
}
