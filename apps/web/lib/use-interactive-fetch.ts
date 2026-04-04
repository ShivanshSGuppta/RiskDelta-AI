"use client";

import { useEffect, useRef, useState } from "react";

export function useInteractiveFetch<T>({
  url,
  enabled = true,
  initialData = null,
}: {
  url: string | null;
  enabled?: boolean;
  initialData?: T | null;
}) {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);

  useEffect(() => {
    if (!enabled || !url) return;

    const currentId = ++requestRef.current;
    const controller = new AbortController();
    const begin = setTimeout(() => {
      setLoading(true);
      setError(null);
    }, 0);

    fetch(url, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response.json() as Promise<T>;
      })
      .then((payload) => {
        if (requestRef.current !== currentId) return;
        setData(payload);
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return;
        if (requestRef.current !== currentId) return;
        setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch");
      })
      .finally(() => {
        if (requestRef.current !== currentId) return;
        setLoading(false);
      });

    return () => {
      clearTimeout(begin);
      controller.abort();
    };
  }, [enabled, url]);

  return { data, loading, error } as const;
}
