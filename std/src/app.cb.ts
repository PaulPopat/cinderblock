import type { CinderBlockBinary } from "@cinderblock-lang/runner";

type AppTaggedProps = {
  key: string;
  _s: string;
};

export function std_app_tagged(this: CinderBlockBinary, props: AppTaggedProps) {
  return this.withTagOf(props.key, props._s).map(
    ({ name }) =>
      (args: Record<string, unknown>) =>
        this.run(name, args),
  );
}

type AppCategoriedProps = {
  _s: string;
};

export function std_app_categoried(this: CinderBlockBinary, props: AppCategoriedProps) {
  return this.withTag(props._s).map(
    ({ name }) =>
      (args: Record<string, unknown>) =>
        this.run(name, args),
  );
}
