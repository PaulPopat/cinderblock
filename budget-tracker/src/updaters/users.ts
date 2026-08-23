import database from "#integration/database";

const appBase = process.env.APP_BASE ?? "http://localhost:8080";

type AddUserProps = {
  id: string;
  email: string;
  password: string;
  created: string;
};

export async function users_addUser(props: AddUserProps) {
  database.run`
    INSERT INTO users (
      id,
      email,
      hashed_password,
      created_at,
      updated_at
    ) VALUES (
      ${props.id},
      ${props.email},
      ${props.password},
      ${props.created},
      ${props.created}
    )
  `;
}

type SendTokenProps = {
  token: string;
};

export async function users_sendToken(props: SendTokenProps) {
  const url = new URL('/register', appBase);
  url.searchParams.set('token', props.token);
  console.log(`Fake email of ${url}`);
}
