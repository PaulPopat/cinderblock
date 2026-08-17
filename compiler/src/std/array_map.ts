import { framise, VariableArray, type VariablePipeable } from "#runner";

type ArrayMapProps = {
  subject: Array<unknown>;
  selector: VariablePipeable;
};

export function std_array_map(props: ArrayMapProps) {
  return new VariableArray(props.subject.map((item, index) => props.selector.execute(framise({ item, index }))));
}
