import { describe, expect, it } from "vitest";
import { generateApiKeyValue, getApiKeyParts, hashApiKey } from "@/server/enforcement/api-keys";

describe("api key helpers", () => {
  it("creates a prefixed api key and stable hash", () => {
    const apiKey = generateApiKeyValue();
    const parts = getApiKeyParts(apiKey);
    const hash = hashApiKey(apiKey);

    expect(apiKey.startsWith("rd_")).toBe(true);
    expect(parts.prefix.length).toBe(12);
    expect(parts.lastFour.length).toBe(4);
    expect(hash).toHaveLength(64);
  });
});
