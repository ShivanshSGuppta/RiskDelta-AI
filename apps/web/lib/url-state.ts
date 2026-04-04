"use client";

import { z } from "zod";

export type UrlStateSchemaShape = Record<string, z.ZodTypeAny>;

export function parseUrlState<T extends UrlStateSchemaShape>(
  params: URLSearchParams,
  schema: z.ZodObject<T>,
  defaults: z.infer<z.ZodObject<T>>,
) {
  const raw = Object.fromEntries(params.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return defaults;
  return { ...defaults, ...parsed.data };
}

export function toUrlSearchParams<T extends Record<string, unknown>>(state: T) {
  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const stringValue = String(value).trim();
    if (!stringValue) return;
    params.set(key, stringValue);
  });
  return params;
}
