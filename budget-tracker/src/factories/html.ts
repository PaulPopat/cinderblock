import pug from "pug";
import fs from "node:fs/promises";
import path from "node:path";

type TemplateProps = {
  name: string;
  data: Record<string, unknown>;
};

export async function html_template(props: TemplateProps) {
  return `<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <title>My test page</title>
  </head>
  <body>
    ${pug.render(await fs.readFile(path.resolve(import.meta.dirname, "../templates", `${props.name}.pug`), "utf8"), props.data)}
  </body>
</html>`;
}
