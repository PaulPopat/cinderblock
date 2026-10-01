export type AppMetadata = {
  funcs: Record<
    string,
    {
      id: string;
      tags: Array<{ key: string; value: string }>;
      location: { file: string; line: number; character: number };
    }
  >;
};

export type AppFunc = {
  id: string;
  name: string;
  tags: Record<string, string>;
};
