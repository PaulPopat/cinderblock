import type { EntityLet } from "#ast";
import {
  Closure,
  Frame,
  Variable,
  VariableArray,
  VariablePrimitiveBool,
  VariablePrimitiveFloat,
  VariablePrimitiveInt,
  VariablePrimitiveNull,
  VariablePrimitiveString,
  VariableTuple,
} from "#runner";

export class App {
  readonly #lets: Array<EntityLet>;

  constructor(lets: Array<EntityLet>) {
    this.#lets = lets;
  }

  variablise(input: unknown): Variable {
    switch (typeof input) {
      case "bigint":
      case "symbol":
      case "function":
        throw new Error("Type unsupported");
      case "boolean":
        return new VariablePrimitiveBool(input);
      case "number":
        if (input % 1 === 0) return new VariablePrimitiveInt(input);
        return new VariablePrimitiveFloat(input);
      case "string":
        return new VariablePrimitiveString(input);
      case "undefined":
        return new VariablePrimitiveNull(null);
      case "object":
        if (!input) return new VariablePrimitiveNull(null);
        if (Array.isArray(input)) return new VariableArray(input.map((i) => this.variablise(i)));
        return new VariableTuple(
          Object.entries(input).reduce((current, [key, value]) => ({ ...current, [key]: this.variablise(value) }), {} as Record<string, Variable>),
        );
    }
  }

  run(name: string, args: Record<string, any>) {
    const frame = new Frame(
      Object.entries(args).reduce((current, [key, value]) => ({ ...current, [key]: this.variablise(value) }), {} as Record<string, Variable>),
    );

    const subject = this.#lets.find((l) => l.fullName === name);
    if (!subject) throw new Error("Subject not found");
    return subject.execute(new Closure([]), frame).export();
  }
}
