import { createHash, randomBytes } from "crypto";
import type { Prisma } from "@prisma/client";

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

export async function createApiKeyRecord({
  tx,
  organizationId,
  userId,
  name,
  scopes,
}: {
  tx: Prisma.TransactionClient;
  organizationId: string;
  userId: string;
  name: string;
  scopes: string[];
}) {
  const rawKey = generateApiKeyValue();
  const { prefix, lastFour } = getApiKeyParts(rawKey);
  const secretHash = hashApiKey(rawKey);

  const apiKey = await tx.apiKey.create({
    data: {
      organizationId,
      userId,
      name,
      prefix,
      lastFour,
      secretHash,
      scopes,
    },
  });

  return { apiKey, rawKey };
}
