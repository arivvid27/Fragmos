"use client";

import type { CSSProperties, ReactNode } from "react";
import { clamp, useScrollProgress } from "./useScrollProgress";

export type Tone = "light" | "dark";

interface Props {
  from: Tone;
  to: Tone;
  shape?: "circle" | "horizon";
  /** Where the circle opens from, as CSS background position. */
  at?: string;
  /** Total scroll length, including the pinned screen. */
  height?: string;
  children: ReactNode;
}

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * A pinned screen that changes tone as you scroll. The same children are rendered twice,
 * once in each tone, and the second copy is revealed through a growing shape, so the text
 * inverts exactly along the edge of the shape. A thin forest line rides the edge.
 */
export function Iris({ from, to, shape = "circle", at = "50% 50%", height = "260vh", children }: Props) {
  const ref = useScrollProgress<HTMLElement>("pin", (p, el) => {
    const e = ease(clamp((p - 0.18) / 0.64));
    el.style.setProperty("--e", e.toFixed(4));
    const tone = e > 0.55 ? to : from;
    if (el.dataset.tone !== tone) {
      el.dataset.tone = tone;
    }
  });

  const stage = { "--at": at } as CSSProperties;

  return (
    <section ref={ref} data-tone={from} style={{ height }} className="relative">
      <div style={stage} className="sticky top-0 h-svh overflow-hidden">
        <div className={`tone-${from} t-bg t-fg absolute inset-0`}>{children}</div>
        <div aria-hidden className={`absolute inset-0 bg-forest iris-ring-${shape}`} />
        <div aria-hidden inert className={`tone-${to} t-bg t-fg absolute inset-0 iris-to-${shape}`}>
          {children}
        </div>
      </div>
    </section>
  );
}
