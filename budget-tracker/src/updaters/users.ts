import database from "#integration/database";

type AddUserProps = {
  id: string;
  email: string;
  hashed_password: string;
};

export async function users_addUser(props: AddUserProps) {
  const time = new Date().toISOString();
  database.run`
    INSERT INTO data (
      id,
      email,
      hashed_password,
      created_at,
      updated_at
    ) VALUES (
      ${props.id},
      ${props.email},
      ${props.hashed_password},
      ${time},
      ${time}
    )
  `;
}
