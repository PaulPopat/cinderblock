import { Frame } from "./Frame.ts";
import { Variable } from "./Variable.ts";
import { VariablePipeable } from "./VariablePipeable.ts";
import { VariablePrimitiveBool } from "./VariablePrimitiveBool.ts";
import { VariablePrimitiveInt } from "./VariablePrimitiveInt.ts";
import { VariablePrimitiveNull } from "./VariablePrimitiveNull.ts";
import { VariableTuple } from "./VariableTuple.ts";

export class VariableArray extends VariableTuple {
  readonly #values: Array<Variable>;

  constructor(values: Array<Variable>) {
    super({
      filter: new VariablePipeable((args) => {
        const predicate = args.search("p");
        if (!(predicate instanceof VariablePipeable)) {
          throw new Error("p must be pipeable");
        }

        return new VariableArray(
          this.#values.filter((value, index, original) => {
            const result = predicate.execute(
              new Frame({
                value,
                index: new VariablePrimitiveInt(index),
                original: new VariableArray(original),
              }),
            );

            if (!(result instanceof VariablePrimitiveBool)) {
              throw new Error("Invalid result");
            }

            return result.value;
          }),
        );
      }),
      find: new VariablePipeable((args) => {
        const predicate = args.search("p");
        if (!(predicate instanceof VariablePipeable)) {
          throw new Error("p must be pipeable");
        }

        const result = this.#values.find((value, index, original) => {
          const result = predicate.execute(
            new Frame({
              value,
              index: new VariablePrimitiveInt(index),
              original: new VariableArray(original),
            }),
          );

          if (!(result instanceof VariablePrimitiveBool)) {
            throw new Error("Invalid result");
          }

          return result.value;
        });

        if (!result) return new VariablePrimitiveNull(null);
        return result;
      }),
      map: new VariablePipeable((args) => {
        const selector = args.search("s");
        if (!(selector instanceof VariablePipeable)) {
          throw new Error("s must be pipeable");
        }

        return new VariableArray(
          this.#values.map((value, index, original) =>
            selector.execute(
              new Frame({
                value,
                index: new VariablePrimitiveInt(index),
                original: new VariableArray(original),
              }),
            ),
          ),
        );
      }),
      reduce: new VariablePipeable((args) => {
        const routine = args.search("r");
        if (!(routine instanceof VariablePipeable)) {
          throw new Error("r must be pipeable");
        }

        const start = args.search("s");
        if (!start) throw new Error("s is required");

        return this.#values.reduce(
          (current, value, index, original) =>
            routine.execute(
              new Frame({
                value,
                index: new VariablePrimitiveInt(index),
                original: new VariableArray(original),
                current,
              }),
            ),
          start,
        );
      }),
    });

    this.#values = values;
  }

  get data() {
    return [...this.#values];
  }

  export() {
    return this.#values.map((v) => v.export());
  }
}
