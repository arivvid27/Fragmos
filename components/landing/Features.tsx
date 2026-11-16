"use client";

import { useState, type ReactNode } from "react";
import { PolicyBar } from "@/components/PolicyBar";
import { ProviderIcon } from "@/components/ProviderIcons";
import { TokenBadge } from "@/components/TokenBadge";
import { ALL_POLICY_IDS, POLICIES, type PolicyId } from "@/lib/policies";
import { PROVIDERS, type ProviderId } from "@/lib/providers";
import { splitTokens } from "@/lib/scrubber";
import { Reveal } from "./Reveal";
import { SAMPLE } from "./sample";
import { useClientScrub } from "./useClientScrub";

const LANTERN = { customTerms: ["Lantern"] };

function Cell({
  span,
  delay,
  light = false,
  children,
}: {
  span: string;
  delay: number;
  light?: boolean;
  children: ReactNode;
}) {
  return (
    <Reveal delay={delay} className={"min-w-0 " + span}>
      <div
        className={`h-full rounded-2xl p-7 md:p-8 ${
          light ? "bg-surface text-ink" : "border t-line t-soft"
        }`}
      >
        {children}
      </div>
    </Reveal>
  );
}

function Term({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.18em] ${light ? "text-taupe" : "t-mute"}`}>{children}</p>
  );
}

function Egress() {
  return (
    <>
      <Term>Raw egress</Term>
      <p className="mt-4 font-serif text-[clamp(5rem,11vw,9rem)] font-normal leading-[0.9] tracking-[-0.05em]">0 B</p>
      <svg viewBox="0 0 400 40" className="mt-6 block h-10 w-full" preserveAspectRatio="none" aria-hidden>
        <line x1="0" x2="400" y1="20" y2="20" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line
          x1="0"
          x2="400"
          y1="20"
          y2="20"
          stroke="var(--color-token)"
          strokeWidth="2"
          strokeDasharray="4 8"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ animation: "drift 2.4s linear infinite" }}
        />
      </svg>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed t-mute">
        Names, IDs, and secrets stay in the tab. What travels is the token version, and you can read every byte of it.
      </p>
    </>
  );
}

function Vault() {
  const scrub = useClientScrub(SAMPLE);
  return (
    <>
      <Term>Vault</Term>
      <h3 className="mt-4 font-serif text-[clamp(1.7rem,2.6vw,2.2rem)] leading-tight tracking-tight">
        Originals live in memory only.
      </h3>
      <ul className="mt-6 space-y-2.5">
        {scrub.vault.slice(0, 4).map((e) => (
          <li key={e.token} className="flex items-center gap-2.5 text-[13px]">
            <span className="shrink-0">
              <TokenBadge token={e.token} />
            </span>
            <span className="t-mute" aria-hidden>
              →
            </span>
            <span className="min-w-0 flex-1 truncate">{e.original}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[13px] t-mute">Close the tab and they are gone.</p>
    </>
  );
}

function Policies() {
  const [active, setActive] = useState<PolicyId[]>(ALL_POLICY_IDS);
  const masked = POLICIES.filter((p) => active.indexOf(p.id) !== -1).reduce((n, p) => n + p.categories.length, 0);
  return (
    <>
      <Term light>Policies</Term>
      <h3 className="mt-4 font-serif text-[clamp(1.7rem,2.6vw,2.2rem)] leading-tight tracking-tight">
        Four sets you can switch on and off.
      </h3>
      <div className="mt-6">
        <PolicyBar
          active={active}
          onToggle={(id) =>
            setActive(active.indexOf(id) === -1 ? [...active, id] : active.filter((p) => p !== id))
          }
          customTerms={[]}
          onRemoveTerm={() => {}}
        />
      </div>
      <p className="mt-5 text-[13px] text-taupe tabular-nums">
        {masked} extra categories masked. Names, emails, phones, and secrets are always on.
      </p>
    </>
  );
}

function Models() {
  const [id, setId] = useState<ProviderId>("claude");
  const [replay, setReplay] = useState(0);
  const provider = PROVIDERS.find((p) => p.id === id) || PROVIDERS[0];
  return (
    <>
      <Term light>Models</Term>
      <h3 className="mt-4 font-serif text-[clamp(1.7rem,2.6vw,2.2rem)] leading-tight tracking-tight">
        Gemini, Claude, or GPT.
      </h3>
      <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl bg-canvas p-1" role="radiogroup" aria-label="Provider">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={p.id === id}
            onClick={() => {
              setId(p.id);
              setReplay((n) => n + 1);
            }}
            className={`group flex flex-col items-center gap-1.5 rounded-[10px] py-3 transition-[background-color,box-shadow] duration-500 ease-ios ${
              p.id === id ? "bg-surface shadow-[0_1px_3px_rgba(44,36,30,0.14)]" : ""
            }`}
          >
            <ProviderIcon id={p.id} selected={p.id === id} replay={replay} />
            <span className={`text-[12.5px] ${p.id === id ? "font-medium text-ink" : "text-taupe"}`}>{p.label}</span>
          </button>
        ))}
      </div>
      <div key={id} className="mt-4 flex animate-fade flex-wrap gap-1.5">
        {provider.models.map((m) => (
          <span key={m} className="rounded-[4px] bg-panel px-2 py-0.5 font-mono text-[11.5px] text-taupe">
            {m}
          </span>
        ))}
      </div>
      <p className="mt-4 text-[13px] text-taupe">Bring your own key. It stays in your tab.</p>
    </>
  );
}

function Explain() {
  const scrub = useClientScrub(SAMPLE);
  const entry = scrub.vault.find((v) => v.category === "RECORD_ID") || scrub.vault[0];
  if (!entry) {
    return null;
  }
  return (
    <>
      <Term light>Explain</Term>
      <h3 className="mt-4 font-serif text-[clamp(1.7rem,2.6vw,2.2rem)] leading-tight tracking-tight">
        Hover a highlight to learn why.
      </h3>
      <div className="mt-6 rounded-xl border border-line bg-canvas p-5">
        <div className="mb-3 flex items-center gap-2">
          <TokenBadge token={entry.token} />
          <span className="text-[12px] font-medium text-terracotta">{entry.label}</span>
        </div>
        <h4 className="mb-1 font-serif text-[15px] font-medium">Why it is sensitive</h4>
        <p className="text-[12.5px] leading-relaxed text-taupe">{entry.whySensitive}</p>
      </div>
    </>
  );
}

function Mask() {
  const [masked, setMasked] = useState(false);
  const text = "She joined the Lantern program in March.";
  const scrub = useClientScrub(text, LANTERN);
  const [before, after] = text.split("Lantern");
  return (
    <>
      <Term>Select to mask</Term>
      <h3 className="mt-4 font-serif text-[clamp(1.7rem,2.6vw,2.2rem)] leading-tight tracking-tight">
        Missed something? Select it.
      </h3>
      <p className="mt-6 text-[15px] leading-[1.85]">
        {masked ? (
          splitTokens(scrub.sanitized).map((piece, i) =>
            piece.isToken ? <TokenBadge key={i} token={piece.text} /> : <span key={i}>{piece.text}</span>,
          )
        ) : (
          <>
            {before}
            <span className="rounded-[2px] bg-canvas/25">Lantern</span>
            {after}
          </>
        )}
      </p>
      <button
        type="button"
        onClick={() => setMasked(!masked)}
        className="mt-5 rounded-lg bg-canvas px-3.5 py-1.5 text-[12.5px] font-medium text-ink transition-colors duration-300 ease-ios hover:bg-token"
      >
        {masked ? "Undo" : "Mask “Lantern”"}
      </button>
    </>
  );
}

export function Features() {
  return (
    <section
      id="features"
      data-tone="dark"
      className="tone-dark t-bg t-fg relative px-[clamp(1.25rem,5vw,4.5rem)] pb-[clamp(6rem,13vw,12rem)] pt-[clamp(2rem,5vw,4rem)]"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.18em] t-mute">Usage</p>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.6rem,6vw,5.2rem)] font-normal leading-[1] tracking-[-0.035em]">
            Everything it does happens in your tab.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-6">
          <Cell span="lg:col-span-4" delay={0}>
            <Egress />
          </Cell>
          <Cell span="lg:col-span-2" delay={90}>
            <Vault />
          </Cell>
          <Cell span="lg:col-span-3" delay={0} light>
            <Policies />
          </Cell>
          <Cell span="lg:col-span-3" delay={90} light>
            <Models />
          </Cell>
          <Cell span="lg:col-span-3" delay={0} light>
            <Explain />
          </Cell>
          <Cell span="lg:col-span-3" delay={90}>
            <Mask />
          </Cell>
        </div>
      </div>
    </section>
  );
}
