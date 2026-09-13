type StringSplitProps = {
  _s: string;
  on: string;
};

export function std_string_split(props: StringSplitProps) {
  return props._s.split(props.on);
}

type StringMatchesProps = {
  _s: string;
  pattern: string;
};

export function std_string_matches(props: StringMatchesProps) {
  return !!props._s.match(props.pattern);
}
