"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { z } from "zod";
import { parseUrlState, toUrlSearchParams, type UrlStateSchemaShape } from "@/lib/url-state";

export function useUrlState<T extends UrlStateSchemaShape>({
  schema,
  defaults,
}: {
  schema: z.ZodObject<T>;
  defaults: z.infer<z.ZodObject<T>>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(
    () => parseUrlState(searchParams, schema, defaults),
    [defaults, schema, searchParams],
  );

  const setState = useCallback(
    (patch: Partial<typeof state>) => {
      const next = { ...state, ...patch };
      const params = toUrlSearchParams(next);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, state],
  );

  return { state, setState } as const;
}
