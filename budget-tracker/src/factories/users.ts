import database from "#integration/database";

type GetUserProps = {
  _s: string;
};

export async function users_getUser(props: GetUserProps) {
  const [row] = database.query`
    SELECT * FROM users WHERE id = ${props._s}
  `;

  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

type GetUserByEmailProps = {
  _s: string;
};

export async function users_getUserByEmail(props: GetUserByEmailProps) {
  const [row] = database.query`
    SELECT * FROM users WHERE email = ${props._s}
  `;

  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    password: row.hashed_password,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
