export function parseRunCommand(args: Array<string>) {
  const [letName, ...parameters] = args;
  if (typeof letName !== "string") {
    console.log("A let name is required");
    process.exit(1);
  }

  const parametersObject = parameters.reduce(
    (record, parameter) => {
      const [key, value] = parameter.replace("--", "").split("=");
      if (!isNaN(value as any)) return { ...record, [key as string]: Number.parseFloat(value as string) };
      return { ...record, [key as string]: value };
    },
    {} as Record<string, unknown>,
  );

  return { letName, parametersObject };
}
