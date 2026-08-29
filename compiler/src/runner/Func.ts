import type { CreateFunc, Instruction } from "#writer";
import type { Closure } from "./Closure.ts";
import { Frame } from "./Frame.ts";
import type { Variable } from "./Variable.ts";
import { VariableArray } from "./VariableArray.ts";
import { VariablePipeable } from "./VariablePipeable.ts";
import { VariablePrimitive } from "./VariablePrimitive.ts";
import { VariablePrimitiveBool } from "./VariablePrimitiveBool.ts";
import { VariablePrimitiveFloat } from "./VariablePrimitiveFloat.ts";
import { VariablePrimitiveInt } from "./VariablePrimitiveInt.ts";
import { VariablePrimitiveNull } from "./VariablePrimitiveNull.ts";
import { VariablePrimitiveString } from "./VariablePrimitiveString.ts";
import { VariableTuple } from "./VariableTuple.ts";

export class Func {
  readonly #model: CreateFunc;
  readonly #closure: Closure;

  constructor(model: CreateFunc, closure: Closure) {
    this.#model = model;
    this.#closure = model.vars.reduce(
      (closure, internal) =>
        closure.withVariable(
          internal.name,
          internal.no_args
            ? this.instruction(internal.returns)
            : new VariablePipeable((args) => new Func(internal, this.#closure.withFrame(args)).execute()),
        ),
      closure,
    );
  }

  async instruction(input: Instruction): Promise<Variable> {
    switch (input.type) {
      case "access": {
        const subject = await this.instruction(input.subject);
        if (!(subject instanceof VariableTuple)) throw new Error("Subject not tuple");
        return subject.get(input.key);
      }
      case "arg": {
        return this.#closure.search(input.name);
      }
      case "array_add": {
        const left = await this.instruction(input.left);
        const right = await this.instruction(input.right);

        if (!(left instanceof VariableArray)) throw new Error("Invalid left");
        if (right instanceof VariableArray) {
          return new VariableArray([...left.data, ...right.data]);
        }

        return new VariableArray([...left.data, right]);
      }
      case "external": {
        return this.#closure.searchGlobal(input.name);
      }
      case "literal_array": {
        return new VariableArray(await Promise.all(input.subject.map((s) => this.instruction(s))));
      }
      case "literal_bool": {
        return new VariablePrimitiveBool(input.value);
      }
      case "literal_char": {
        throw new Error("Not implemented");
      }
      case "literal_double": {
        throw new Error("Not implemented");
      }
      case "literal_float": {
        return new VariablePrimitiveFloat(input.value);
      }
      case "literal_int": {
        return new VariablePrimitiveInt(input.value);
      }
      case "literal_long": {
        throw new Error("Not implemented");
      }
      case "literal_null": {
        return new VariablePrimitiveNull(null);
      }
      case "literal_string": {
        return new VariablePrimitiveString(input.value);
      }
      case "not": {
        const subject = await this.instruction(input.subject);
        return new VariablePrimitiveBool(!subject);
      }
      case "reference": {
        return this.#closure.search(input.name);
      }
      case "ternary": {
        const predicate = await this.instruction(input.predicate);
        if (!(predicate instanceof VariablePrimitiveBool)) {
          throw new Error("Invalid type");
        }

        return predicate.value ? await this.instruction(input.positive) : await this.instruction(input.negative);
      }
      case "tuple": {
        return new VariableTuple(
          Object.fromEntries(await Promise.all(input.parts.map(async ([name, instruction]) => [name, await this.instruction(instruction)] as const))),
        );
      }
      case "operator": {
        let left = await this.instruction(input.left);
        const right = await this.instruction(input.right);

        switch (input.operator) {
          case "pipe": {
            if (!(left instanceof VariableTuple)) {
              left = new VariableTuple({ _s: left });
            }

            if (!(right instanceof VariablePipeable)) {
              throw new Error("Pipeable required");
            }

            const frame = new Frame({
              ...(left as VariableTuple).entries.reduce(
                (frame, [key, value]) => ({
                  ...frame,
                  [key]: value,
                }),
                {} as Record<string, Variable>,
              ),
            });

            return right.execute(frame);
          }
          case "partial_pipe": {
            if (!(left instanceof VariableTuple)) {
              left = new VariableTuple({ _s: left });
            }

            if (!(right instanceof VariablePipeable)) {
              throw new Error("Pipeable required");
            }

            const frame = new Frame({
              ...(left as VariableTuple).entries.reduce(
                (frame, [key, value]) => ({
                  ...frame,
                  [key]: value,
                }),
                {} as Record<string, Variable>,
              ),
            });

            return new VariablePipeable((args) => right.execute(frame.merge(args)));
          }
          case "in": {
            if (!(left instanceof VariablePrimitiveString)) {
              throw new Error("String required");
            }

            if (!(right instanceof VariableTuple)) {
              return new VariablePrimitiveBool(false);
            }

            return new VariablePrimitiveBool(right.has(left.value));
          }
          default: {
            if (!(left instanceof VariablePrimitive) || !(right instanceof VariablePrimitive)) {
              throw new Error("Primitive required");
            }
            return left[input.operator](right);
          }
        }
      }
    }
  }

  execute() {
    return this.instruction(this.#model.returns);
  }
}
