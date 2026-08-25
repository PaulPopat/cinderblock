const appBase = process.env.APP_BASE ?? "http://localhost:8080";

type SendTokenProps = {
  token: string;
};

export async function users_sendToken(props: SendTokenProps) {
  const url = new URL("/register", appBase);
  url.searchParams.set("token", props.token);
  console.log(`Fake email of ${url}`);
}
