type StringSplitProps = {
  _s: string;
  on: string;
};

export function std_string_split(props: StringSplitProps) {
  return props._s.split(props.on);
}
