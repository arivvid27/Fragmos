"use client";

import { useEffect, useRef } from "react";

export type ScrollMode = "pin" | "exit";

export function clamp(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * Writes a 0..1 scroll progress to the element as the CSS variable `--p`.
 * "pin"  : 0 when the element reaches the top, 1 when its sticky stage has been fully scrolled.
 * "exit" : 0 when the element sits at the top, 1 when it has scrolled completely out of view.
 * The optional callback receives the same value, so stateful pieces can react to it.
 */
export function useScrollProgress<T extends HTMLElement>(
  mode: ScrollMode,
  onProgress?: (p: number, el: T) => void,
) {
  const ref = useRef<T>(null);
  const handler = useRef(onProgress);

  useEffect(() => {
    handler.current = onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    let raf = 0;

    function update() {
      raf = 0;
      if (!el) {
        return;
      }
      const rect = el.getBoundingClientRect();
      const span = mode === "pin" ? rect.height - window.innerHeight : rect.height;
      const p = span > 0 ? clamp(-rect.top / span) : 0;
      el.style.setProperty("--p", p.toFixed(4));
      if (handler.current) {
        handler.current(p, el);
      }
    }

    function onScroll() {
      if (!raf) {
        raf = requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) {
        cancelAnimationFrame(raf);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mode]);

  return ref;
}
