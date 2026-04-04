import { expect, test } from "@playwright/test";

test("landing page renders core messaging", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Control unsafe AI runtime behavior before it reaches production\./i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Try free" })).toBeVisible();
  await expect(page.locator("[data-brand-mark]").first()).toBeVisible();
});

test("auth pages are reachable", async ({ page }) => {
  await page.goto("/signin");
  await expect(page.getByRole("heading", { name: "Sign in to inspect live runtime decisions." })).toBeVisible();
  await expect(page.locator("[data-brand-mark]").first()).toBeVisible();

  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: "Create the workspace that controls AI runtime behavior." })).toBeVisible();
  await expect(page.locator("[data-brand-mark]").first()).toBeVisible();
});

test("public Gemini marketing pages are reachable", async ({ page }) => {
  await page.goto("/security");
  await expect(page.getByRole("heading", { name: /Runtime evidence, intervention history, and operator accountability stay attached\./i })).toBeVisible();
  await expect(page.locator("[data-brand-mark]").first()).toBeVisible();

  await page.goto("/docs-preview");
  await expect(page.getByRole("heading", { name: /Concepts, snippets, and runtime examples before you enter the workspace\./i })).toBeVisible();

  await page.goto("/integrations");
  await expect(page.getByRole("heading", { name: /Instrument through code, API, or connectors and land in the same control plane\./i })).toBeVisible();

  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: /Priced around runtime visibility, control coverage, and operator scale\./i })).toBeVisible();
});
