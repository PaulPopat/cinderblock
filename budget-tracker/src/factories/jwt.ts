import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET ?? "test-secret";

export function jwt_encode(props: any) {
  return new Promise<string>((resolve, reject) =>
    jwt.sign(props, secret, (error: Error | null, result: string | undefined) => {
      if (error || !result) reject(error);
      else resolve(result);
    }),
  );
}

export function jwt_verify({ _s }: { _s: string }) {
  return new Promise<any>((resolve) =>
    jwt.verify(_s, secret, (error: Error | null, result) => {
      if (error || !result) resolve(null);
      else resolve(result);
    }),
  );
}
