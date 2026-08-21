import type { Frame } from "./Frame.ts";
import type { Variable } from "./Variable.ts";

export class Closure {
  readonly #frames: Array<Frame>;

  constructor(frames: Array<Frame>) {
    this.#frames = frames;
  }

  search(name: string, displayName: string) {
    for (const frame of this.#frames) {
      const possible = frame.search(name);
      if (possible) return possible;
    }

    throw new Error(`Variable ${displayName} not resolved`);
  }

  withFrame(frame: Frame) {
    return new Closure([...this.#frames, frame]);
  }

  withVariable(name: string, value: Variable) {
    const frame = this.#frames.findLast(() => true);
    if (!frame) throw new Error("Not within a frame");
    return new Closure([...this.#frames.filter((f) => f !== frame), frame.withVariable(name, value)]);
  }
}
