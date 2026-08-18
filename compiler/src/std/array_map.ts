type ArrayMapProps = {
  _s: Array<unknown>;
  selector: (props: { item: unknown; index: number }) => unknown;
};

export function std_array_map(props: ArrayMapProps) {
  return props._s.map((item, index) => props.selector({ item, index }));
}
