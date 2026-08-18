type ArrayGetProps = {
  _s: Array<unknown>;
  i: number;
};

export function std_array_get(props: ArrayGetProps) {
  return props._s[props.i];
}
