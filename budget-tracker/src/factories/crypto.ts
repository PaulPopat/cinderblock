import Crypto from "node:crypto";

export async function crypto_guid() {
  return Crypto.randomUUID();
}

export async function crypto_bytes(props: { _s: number }) {
  return Crypto.randomBytes(props._s).toString("hex");
}

type ScryptProps = {
  _s: string;
  salt: string;
  keylen: number;
};

export async function crypto_scrypt(props: ScryptProps) {
  return new Promise<string>((resolve, reject) => {
    Crypto.scrypt(props._s, Buffer.from(props.salt, "hex"), props.keylen, (err, buf) => {
      if (err) reject(err);
      else resolve(buf.toString("hex"));
    });
  });
}

type TimingSafeEqualProps = {
  left: string;
  right: string;
};

export async function crypto_timingSafeEqual(props: TimingSafeEqualProps) {
  try {
    return Crypto.timingSafeEqual(Buffer.from(props.left, "hex"), Buffer.from(props.right, "hex"));
  } catch (err) {
    console.error(err);
    return false;
  }
}
