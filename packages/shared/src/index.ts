import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "crypto";

export function createId(prefix: string) {
  return `${prefix}_${randomUUID().replace(/-/g, "")}`;
}

export function nowIso() {
  return new Date().toISOString();
}

function deriveKey(secret: string) {
  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(value: string, secret: string) {
  const iv = randomBytes(12);
  const key = deriveKey(secret);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptSecret(ciphertext: string, secret: string) {
  const buffer = Buffer.from(ciphertext, "base64url");
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const payload = buffer.subarray(28);
  const key = deriveKey(secret);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(payload), decipher.final()]).toString("utf8");
}
