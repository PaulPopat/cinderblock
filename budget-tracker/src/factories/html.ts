import pug from "pug";
import path from "node:path";

type TemplateProps = {
  name: string;
  data: Record<string, unknown>;
};

export async function html_template(props: TemplateProps) {
  return pug.renderFile(path.resolve(import.meta.dirname, "../templates", `${props.name}.pug`), props.data);
}
