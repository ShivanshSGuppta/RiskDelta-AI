import { createHash, randomBytes } from "crypto";

export function generateApiKeyValue() {
  return `rd_${randomBytes(24).toString("base64url")}`;
}

export function hashApiKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function getApiKeyParts(value: string) {
  return {
    prefix: value.slice(0, 12),
    lastFour: value.slice(-4),
  };
}
