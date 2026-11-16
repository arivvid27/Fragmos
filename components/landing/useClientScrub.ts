"use client";

import { useMemo, useSyncExternalStore } from "react";
import { scrubText, type ScrubOptions, type ScrubResult } from "@/lib/scrubber";

const EMPTY: ScrubResult = { sanitized: "", vault: [], spans: [], elapsedMs: 0 };

function subscribe() {
  return () => {};
}

/**
 * The detector uses Math.random inside its language library, which Cache Components
 * refuses to evaluate during prerender. Running it only after hydration keeps the static
 * shell valid; the real result appears on the first client render.
 */
export function useClientScrub(text: string, options?: ScrubOptions): ScrubResult {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return useMemo(() => (mounted ? scrubText(text, options) : EMPTY), [mounted, text, options]);
}
