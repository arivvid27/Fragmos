"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  countRestored,
  rehydrateSegments,
  splitTokens,
  type VaultEntry,
} from "@/lib/scrubber";
import { TokenBadge } from "@/components/TokenBadge";
import { SAMPLE } from "./sample";
import { useClientScrub } from "./useClientScrub";
import { useScrollProgress } from "./useScrollProgress";

const STEPS = [
  {
    verb: "Detect",
    text: "Finds names, IDs, contacts, and secrets as you type. Hover any highlight to see why it matters.",
  },
  {
    verb: "Replace",
    text: "Swaps each one for a token like [SUBJECT_1]. The originals go into a vault that lives in memory only.",
  },
  {
    verb: "Send",
    text: "Only the tokens leave your device. The wire view shows the exact payload, byte for byte.",
  },
  {
    verb: "Restore",
    text: "The reply comes back with tokens in it, and your device puts the real words back.",
  },
];

const LABELS = ["Input", "Input", "Sanitized", "Wire", "Response"];
const STATUS = ["Preview, not sent", "Preview, not sent", "Preview, not sent", "Sent", "Delivered"];

function stepFor(p: number) {
  if (p < 0.05) return 0;
  if (p < 0.28) return 1;
  if (p < 0.5) return 2;
  if (p < 0.74) return 3;
  return 4;
}

function tokenFor(vault: VaultEntry[], pattern: RegExp, fallback: number) {
  const hit = vault.find((v) => pattern.test(v.original));
  if (hit) {
    return hit.token;
  }
  if (vault.length === 0) {
    return "[SUBJECT_1]";
  }
  return vault[fallback % vault.length].token;
}

function Layer({ on, passed, children }: { on: boolean; passed: boolean; children: ReactNode }) {
  let off = "translate-y-4 opacity-0 blur-[6px]";
  if (passed) {
    off = "-translate-y-4 opacity-0 blur-[6px]";
  }
  return (
    <div
      aria-hidden={!on}
      className={`[grid-area:1/1] transition-[opacity,transform,filter] duration-700 ease-ios ${
        on ? "translate-y-0 opacity-100 blur-0" : "pointer-events-none " + off
      }`}
    >
      {children}
    </div>
  );
}

export function Story() {
  const [step, setStep] = useState(0);
  const ref = useScrollProgress<HTMLElement>("pin", (p) => setStep(stepFor(p)));

  const scrub = useClientScrub(SAMPLE);
  const payload = useMemo(() => JSON.stringify({ sanitizedPrompt: scrub.sanitized }, null, 2), [scrub]);
  const bytes = useMemo(() => new TextEncoder().encode(payload).length, [payload]);

  const response = useMemo(() => {
    const parent = tokenFor(scrub.vault, /sarah/i, 2);
    const student = tokenFor(scrub.vault, /marcus/i, 0);
    const manager = tokenFor(scrub.vault, /rostova/i, 1);
    return (
      "Dear " + parent + ",\n\nThank you for meeting with us about " + student +
      ". He will keep extended time and chunked instructions, and " + manager +
      " will check in with you every two weeks.\n\nWarmly,\n" + manager
    );
  }, [scrub]);
  const segments = useMemo(() => rehydrateSegments(response, scrub.vault), [response, scrub.vault]);
  const restored = countRestored(segments);

  const active = Math.max(step, 1);

  const raw: ReactNode[] = [];
  let cursor = 0;
  for (let i = 0; i < scrub.spans.length; i++) {
    const s = scrub.spans[i];
    if (s.start > cursor) {
      raw.push(SAMPLE.slice(cursor, s.start));
    }
    raw.push(
      <mark
        key={i}
        style={{ transitionDelay: step >= 1 ? i * 110 + "ms" : "0ms" }}
        className={`rounded-[2px] text-inherit transition-[background-color,box-shadow] duration-500 ease-ios ${
          step >= 1
            ? "bg-risk shadow-[inset_0_-2px_0_var(--color-risk-line)]"
            : "bg-transparent shadow-[inset_0_-2px_0_transparent]"
        }`}
      >
        {SAMPLE.slice(s.start, s.end)}
      </mark>,
    );
    cursor = s.end;
  }
  if (cursor < SAMPLE.length) {
    raw.push(SAMPLE.slice(cursor));
  }

  const badges = (text: string) =>
    splitTokens(text).map((piece, i) =>
      piece.isToken ? <TokenBadge key={i} token={piece.text} /> : <span key={i}>{piece.text}</span>,
    );

  return (
    <section
      id="how"
      ref={ref}
      data-tone="dark"
      style={{ height: "540vh" }}
      className="tone-dark t-bg t-fg relative"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden px-[clamp(1.25rem,5vw,4.5rem)] pb-6 pt-20 lg:pb-10 lg:pt-24">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div>
            <p className="mb-3 text-[12px] uppercase lg:mb-6 tracking-[0.18em] t-mute">How it works</p>
            <ol className="space-y-2 md:space-y-4">
              {STEPS.map((s, i) => {
                const on = active === i + 1;
                return (
                  <li key={s.verb} className={on ? "" : "max-lg:hidden"}>
                    <div
                      className="flex items-baseline gap-4 transition-opacity duration-700 ease-ios"
                      style={{ opacity: on ? 1 : 0.26 }}
                    >
                      <span className="w-6 font-mono text-[12px] t-mute">0{i + 1}</span>
                      <span className="font-serif text-[clamp(2.3rem,5.2vw,4.6rem)] leading-none tracking-[-0.03em]">
                        {s.verb}
                      </span>
                      <span className="font-serif text-[18px] italic t-mute">v.</span>
                    </div>
                    <div
                      className="grid transition-[grid-template-rows,opacity] duration-700 ease-ios"
                      style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0 }}
                    >
                      <p className="overflow-hidden pl-10 text-[15px] leading-relaxed t-mute">
                        <span className="block max-w-md pt-3">{s.text}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="overflow-hidden rounded-2xl bg-surface text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)]">
            <div className="flex items-baseline justify-between bg-panel px-6 py-3.5">
              <span className="font-serif text-[18px] font-medium tracking-tight">{LABELS[step]}</span>
              <span
                className={`text-[12px] transition-colors duration-500 ease-ios ${
                  step >= 3 ? "text-forest" : "text-taupe"
                }`}
              >
                {STATUS[step]}
              </span>
            </div>

            <div className="grid min-h-[12.5rem] px-6 py-4 md:min-h-[19rem] md:py-5">
              <Layer on={step <= 1} passed={false}>
                <p className="whitespace-pre-wrap break-words text-[14px] leading-[1.85]">{raw}</p>
              </Layer>
              <Layer on={step === 2} passed={step > 2}>
                <p className="whitespace-pre-wrap break-words text-[14px] leading-[1.85]">{badges(scrub.sanitized)}</p>
              </Layer>
              <Layer on={step === 3} passed={step > 3}>
                <pre className="whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed">{badges(payload)}</pre>
                <p className="mt-3 text-[12px] text-taupe tabular-nums">To the model via /api/chat · {bytes.toLocaleString()} B</p>
              </Layer>
              <Layer on={step === 4} passed={false}>
                <p className="whitespace-pre-wrap break-words text-[14px] leading-[1.85]">
                  {segments.map((s, i) =>
                    s.entry ? (
                      <span key={i} title={s.entry.token} className="rounded-[2px] bg-token text-token-ink">
                        {s.text}
                      </span>
                    ) : (
                      <span key={i}>{s.text}</span>
                    ),
                  )}
                </p>
                <p className="mt-3 text-[12px] text-taupe tabular-nums">
                  {restored} {restored === 1 ? "detail" : "details"} restored on this device
                </p>
              </Layer>
            </div>

            <div className="border-t border-line bg-panel px-6 py-4">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-serif text-[16px] font-medium">Vault</span>
                <span className="text-[12px] text-taupe tabular-nums">
                  {step >= 2 ? scrub.vault.length : 0} entries, memory only
                </span>
              </div>
              <ul className="grid gap-x-6 gap-y-1 max-sm:[&>li:nth-child(n+4)]:hidden sm:grid-cols-2">
                {scrub.vault.slice(0, 6).map((e, i) => (
                  <li
                    key={e.token}
                    style={{ transitionDelay: step >= 2 ? i * 70 + "ms" : "0ms" } as CSSProperties}
                    className={`flex items-center gap-2 text-[12.5px] transition-[opacity,transform] duration-600 ease-ios ${
                      step >= 2 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    }`}
                  >
                    <TokenBadge token={e.token} />
                    <span className="text-taupe/60" aria-hidden>
                      →
                    </span>
                    <span className="min-w-0 flex-1 truncate text-terracotta">{e.original}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-(color:--t-line)">
          <div className="h-full origin-left bg-token" style={{ transform: "scaleX(var(--p, 0))" }} />
        </div>
      </div>
    </section>
  );
}
