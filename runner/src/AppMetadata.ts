export type AppMetadata = {
  funcs: Record<
    string,
    {
      id: string;
      tags: Array<{ key: string; value: string }>;
    }
  >;
};
