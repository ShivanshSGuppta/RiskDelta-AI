import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseUrlState, toUrlSearchParams } from "@/lib/url-state";

describe("url-state helpers", () => {
  const schema = z.object({
    topic: z.string().optional(),
    step: z.string().optional(),
  });

  it("parses valid values and merges defaults", () => {
    const params = new URLSearchParams("topic=runtime-controls");
    const result = parseUrlState(params, schema, { topic: "getting-started", step: "01" });

    expect(result.topic).toBe("runtime-controls");
    expect(result.step).toBe("01");
  });

  it("falls back to defaults on schema parse failure", () => {
    const strict = z.object({
      step: z.enum(["01", "02"]),
    });
    const params = new URLSearchParams("step=99");
    const result = parseUrlState(params, strict, { step: "01" });
    expect(result.step).toBe("01");
  });

  it("serializes only non-empty values", () => {
    const params = toUrlSearchParams({
      topic: "docs",
      empty: "",
      nullable: null,
      undef: undefined,
      step: "02",
    });
    expect(params.toString()).toBe("topic=docs&step=02");
  });
});
