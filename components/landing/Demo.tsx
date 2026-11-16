"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Editor } from "@/components/Editor";
import { Inspector } from "@/components/Inspector";
import { Label } from "@/components/Label";
import { PolicyBar } from "@/components/PolicyBar";
import { ALL_POLICY_IDS, disabledCategories, type PolicyId } from "@/lib/policies";
import { PRESETS, type Preset } from "@/lib/presets";
import type { ScrubOptions } from "@/lib/scrubber";
import { Reveal } from "./Reveal";
import { useClientScrub } from "./useClientScrub";

export function Demo() {
  const [input, setInput] = useState(PRESETS[0].text);
  const [activePreset, setActivePreset] = useState<Preset["id"] | null>(PRESETS[0].id);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [policies, setPolicies] = useState<PolicyId[]>(ALL_POLICY_IDS);
  const [customTerms, setCustomTerms] = useState<string[]>([]);

  const options: ScrubOptions = useMemo(
    () => ({ customTerms: customTerms, disabled: disabledCategories(policies) }),
    [customTerms, policies],
  );
  const deferredInput = useDeferredValue(input);
  const scrub = useClientScrub(deferredInput, options);
  const payload = JSON.stringify({ sanitizedPrompt: scrub.sanitized }, null, 2);

  function togglePolicy(id: PolicyId) {
    if (policies.indexOf(id) === -1) {
      setPolicies([...policies, id]);
    } else {
      setPolicies(policies.filter((p) => p !== id));
    }
  }

  function maskTerm(term: string) {
    if (!customTerms.some((t) => t.toLowerCase() === term.toLowerCase())) {
      setCustomTerms([...customTerms, term]);
    }
  }

  return (
    <section
      id="try"
      data-tone="dark"
      className="tone-dark t-bg t-fg relative px-[clamp(1.25rem,5vw,4.5rem)] py-[clamp(6rem,13vw,12rem)]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <Reveal>
              <p className="text-[12px] uppercase tracking-[0.18em] t-mute">Try it</p>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.4rem,5.2vw,4.6rem)] font-normal leading-[1.02] tracking-[-0.035em]">
                Paste something private. Nothing is sent.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={180} className="max-w-xs text-[15px] leading-relaxed t-mute">
            This is the real detector, running in your tab. Hover a highlight, select a word it missed, or switch a policy off.
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-14">
          <div className="overflow-hidden rounded-2xl bg-surface text-ink shadow-[0_50px_120px_-40px_rgba(0,0,0,0.7)]">
            <div className="grid lg:grid-cols-[3fr_2fr]">
              <div className="min-w-0 bg-surface px-6 pb-6 pt-6 md:px-8">
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <Label>Input</Label>
                  <p className="text-[12.5px] text-taupe">
                    Try a sample:{" "}
                    {PRESETS.map((p, i) => (
                      <span key={p.id}>
                        {i > 0 && <span className="px-1.5 text-line">·</span>}
                        <button
                          type="button"
                          onClick={() => {
                            setInput(p.text);
                            setActivePreset(p.id);
                          }}
                          className={`underline-offset-4 transition-colors duration-200 hover:text-forest hover:underline ${
                            activePreset === p.id ? "text-ink underline" : ""
                          }`}
                        >
                          {p.label}
                        </button>
                      </span>
                    ))}
                  </p>
                </div>

                <Editor
                  value={input}
                  onChange={(v) => {
                    setInput(v);
                    setActivePreset(null);
                  }}
                  deferredText={deferredInput}
                  spans={scrub.spans}
                  vault={scrub.vault}
                  activeToken={activeToken}
                  onActiveToken={setActiveToken}
                  onMaskTerm={maskTerm}
                  onSubmit={() => {}}
                />

                <div className="mt-6 flex flex-wrap items-start justify-between gap-x-6 gap-y-4 border-t border-line pt-5">
                  <PolicyBar
                    active={policies}
                    onToggle={togglePolicy}
                    customTerms={customTerms}
                    onRemoveTerm={(term) => setCustomTerms(customTerms.filter((t) => t !== term))}
                  />
                  <Link
                    href="/app"
                    className="group flex items-center gap-2.5 rounded-lg bg-forest px-5 py-2.5 text-[13.5px] font-semibold text-white transition-[background-color,transform] duration-300 ease-ios hover:bg-forest-deep active:scale-[0.98]"
                  >
                    Send it for real
                    <span className="transition-transform duration-500 ease-ios group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </Link>
                </div>
              </div>

              <aside aria-label="Wire and vault" className="border-t border-line bg-panel lg:min-h-[34rem] lg:border-l lg:border-t-0">
                <Inspector
                  payload={payload}
                  phase="idle"
                  vault={scrub.vault}
                  activeToken={activeToken}
                  onActiveToken={setActiveToken}
                />
              </aside>
            </div>
          </div>
        </Reveal>

        <p className="mt-5 text-[12px] t-mute tabular-nums" suppressHydrationWarning>
          Scrubbed {deferredInput.length.toLocaleString()} characters in {scrub.elapsedMs.toFixed(1)} ms, on this device.
        </p>
      </div>
    </section>
  );
}
