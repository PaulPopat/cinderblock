import type { Routine } from "./Routine.ts";

export class Binary {
  readonly #routines: Array<Routine>;

  constructor(routines: Array<Routine>) {
    this.#routines = routines;
  }

  get routines() {
    return [...this.#routines];
  }

  withRoutine(routine: Routine) {
    return new Binary([...this.#routines, routine]);
  }
}
