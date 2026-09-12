import type {
  Variable,
  VariableArray,
  VariablePipeable,
  VariablePrimitiveBool,
  VariablePrimitiveChar,
  VariablePrimitiveDouble,
  VariablePrimitiveFloat,
  VariablePrimitiveInt,
  VariablePrimitiveLong,
  VariablePrimitiveNull,
  VariablePrimitiveString,
  VariableTuple,
} from "#variable";

function variabliseArray(input: Array<unknown>): VariableArray {
  return {
    type: 0,
    data: input.map((i) => variablise(i)),
  };
}

function extractArray(input: VariableArray): Array<unknown> {
  return input.data.map((d) => extract(d));
}

type PipeableFunc = (args: Record<string, unknown>) => unknown;

function variablisePipeable(input: PipeableFunc): VariablePipeable {
  return {
    type: 1,
    data: (args) => variablise(input(extractTuple(args))),
  };
}

function extractPipeable(input: VariablePipeable): PipeableFunc {
  return (args: Record<string, unknown>) => extract(input.data(variabliseTuple(args)));
}

function variabliseBool(input: boolean): VariablePrimitiveBool {
  return {
    type: 2,
    data: input,
  };
}

function extractBool(input: VariablePrimitiveBool) {
  return input.data;
}

function variabliseChar(input: number): VariablePrimitiveChar {
  return {
    type: 7,
    data: input,
  };
}

function extractChar(input: VariablePrimitiveChar) {
  return input.data;
}

function extractDouble(input: VariablePrimitiveDouble) {
  return input.data;
}

function variabliseFloat(input: number): VariablePrimitiveFloat {
  return {
    type: 3,
    data: input,
  };
}

function extractFloat(input: VariablePrimitiveFloat) {
  return input.data;
}

function variabliseInt(input: number): VariablePrimitiveInt {
  return {
    type: 4,
    data: input,
  };
}

function extractInt(input: VariablePrimitiveInt) {
  return input.data;
}

function variabliseLong(input: bigint): VariablePrimitiveLong {
  return {
    type: 8,
    data: input,
  };
}

function extractLong(input: VariablePrimitiveLong) {
  return input.data;
}

function variabliseNull(input: null): VariablePrimitiveNull {
  return {
    type: 5,
    data: input,
  };
}

function extractNull(input: VariablePrimitiveNull) {
  return input.data;
}

function variabliseString(input: string): VariablePrimitiveString {
  return {
    type: 6,
    data: input,
  };
}

function extractString(input: VariablePrimitiveString) {
  return input.data;
}

export function variabliseTuple(input: Record<string, unknown>): VariableTuple {
  return {
    type: 10,
    data: Object.entries(input).map(([name, value]) => {
      if (typeof name !== "string") {
        throw new Error("Only string keys are supported on objects");
      }

      return { name, value: variablise(value) };
    }),
  };
}

function extractTuple(input: VariableTuple): Record<string, unknown> {
  return Object.fromEntries(input.data.map((d) => [d.name, extract(d.value)]));
}

export function variablise(input: unknown): Variable {
  switch (typeof input) {
    case "bigint":
      return variabliseLong(input);
    case "boolean":
      return variabliseBool(input);
    case "string":
      return variabliseString(input);
    case "function":
      return variablisePipeable(input as PipeableFunc);
    case "number":
      if (input % 1 !== 0) {
        if (input < 255) {
          return variabliseChar(input);
        }

        return variabliseInt(input);
      }

      return variabliseFloat(input);
    case "object":
      if (!input) {
        return variabliseNull(input);
      }

      if (Array.isArray(input)) {
        return variabliseArray(input);
      }

      return variabliseTuple(input as Record<string, unknown>);
    default:
      throw new Error("Unsupported type");
  }
}

export function extract(input: Variable): unknown {
  switch (input.type) {
    case 0:
      return extractArray(input);
    case 1:
      return extractPipeable(input);
    case 2:
      return extractBool(input);
    case 3:
      return extractFloat(input);
    case 4:
      return extractInt(input);
    case 5:
      return extractNull(input);
    case 6:
      return extractString(input);
    case 7:
      return extractChar(input);
    case 8:
      return extractLong(input);
    case 9:
      return extractDouble(input);
    case 10:
      return extractTuple(input);
  }
}
