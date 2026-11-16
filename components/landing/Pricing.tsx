import Link from "next/link";
import { Reveal } from "./Reveal";

const FREE_FEATURES = [
  "Masking that runs in your browser",
  "HIPAA, PCI, Gov IDs, and Projects policies",
  "Mask any custom term you select",
  "Wire and Vault inspector",
  "Gemini, Claude, and GPT",
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="mt-[3px] h-4 w-4 shrink-0 text-forest" aria-hidden>
      <path d="m4.5 10.5 3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      data-tone="light"
      className="tone-light t-bg t-fg relative px-[clamp(1.25rem,5vw,4.5rem)] pb-[clamp(6rem,13vw,12rem)] pt-[clamp(5rem,10vw,9rem)]"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.18em] t-mute">Pricing</p>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="mt-5 font-serif text-[clamp(2.8rem,6.5vw,5.6rem)] font-normal leading-[1] tracking-[-0.035em]">
            Choose your sense.
          </h2>
        </Reveal>
        <Reveal delay={160} className="mt-5 max-w-md text-[16px] leading-relaxed t-mute">
          Free for personal use and for education. Enterprise is coming soon.
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Reveal delay={0}>
            <div className="flex h-full flex-col rounded-2xl border t-line bg-surface p-8 md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-[18px] italic t-mute">sense 1</span>
                <span className="rounded-full bg-token px-3 py-1 text-[12px] font-medium text-token-ink">Available now</span>
              </div>
              <h3 className="mt-6 font-serif text-[clamp(1.8rem,3vw,2.4rem)] leading-tight tracking-tight">
                Personal and Education
              </h3>
              <p className="mt-6 flex items-baseline gap-3">
                <span className="font-serif text-[clamp(4.5rem,8vw,6.5rem)] leading-none tracking-[-0.05em]">$0</span>
                <span className="text-[14px] t-mute">free to use</span>
              </p>
              <ul className="mt-8 space-y-3 text-[15px]">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t t-line pt-4 text-[13px] t-mute">Usage limits will be listed here.</p>
              <Link
                href="/app"
                className="group mt-8 flex items-center justify-center gap-3 rounded-lg bg-forest px-6 py-3.5 text-[14px] font-semibold text-white transition-[background-color,transform] duration-300 ease-ios hover:bg-forest-deep active:scale-[0.98]"
              >
                Open Fragmós
                <span className="transition-transform duration-500 ease-ios group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <div className="tone-dark t-bg t-fg flex h-full flex-col rounded-2xl p-8 md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-[18px] italic t-mute">sense 2</span>
                <span className="rounded-full border t-line px-3 py-1 text-[12px] font-medium">Coming soon</span>
              </div>
              <h3 className="mt-6 font-serif text-[clamp(1.8rem,3vw,2.4rem)] leading-tight tracking-tight">Enterprise</h3>
              <p className="mt-6 flex items-baseline gap-3">
                <span className="font-serif text-[clamp(4.5rem,8vw,6.5rem)] italic leading-none tracking-[-0.05em]">Soon</span>
              </p>
              <p className="mt-8 max-w-sm text-[15px] leading-relaxed t-mute">
                For districts, clinics, and companies that need Fragmós across a whole team. Details will follow.
              </p>
              <div className="flex-1" />
              <button
                type="button"
                disabled
                className="mt-8 flex cursor-not-allowed items-center justify-center rounded-lg border t-line px-6 py-3.5 text-[14px] font-semibold opacity-60"
              >
                Coming soon
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
