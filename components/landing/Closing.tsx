import Link from "next/link";
import { ScrubWords } from "./ScrubWords";

/** Content for the first transition, rendered once per tone by <Iris>. */
export function Principle() {
  return (
    <div className="flex h-full items-center px-[clamp(1.25rem,5vw,4.5rem)]">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-8 text-[12px] uppercase tracking-[0.18em] t-mute">Principle</p>
        <ScrubWords
          text="[Marcus Vance], [Student ID 884920], and every [API key] you paste stay on this device. The model only ever reads tokens."
          className="font-serif text-[clamp(2.3rem,6.2vw,5.8rem)] leading-[1.05] tracking-[-0.03em]"
        />
      </div>
    </div>
  );
}

/** Content for the transition into pricing. */
export function Free() {
  return (
    <div className="flex h-full items-center px-[clamp(1.25rem,5vw,4.5rem)]">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-8 text-[12px] uppercase tracking-[0.18em] t-mute">Price</p>
        <ScrubWords
          text="Free for personal use. Free for education. Enterprise is on its way."
          className="font-serif text-[clamp(2.3rem,6.2vw,5.8rem)] leading-[1.05] tracking-[-0.03em]"
        />
      </div>
    </div>
  );
}

/** Content for the last transition, with the headword set large once more. */
export function Finale() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-[clamp(1.25rem,5vw,4.5rem)] text-center">
      <p className="font-serif text-[clamp(1.1rem,1.8vw,1.5rem)] italic t-mute">frag·mós, noun</p>
      <p className="mt-2 font-serif text-[clamp(5.2rem,23.5vw,27rem)] font-light leading-[0.86] tracking-[-0.055em]">
        Fragmós
      </p>
      <p className="mt-6 max-w-xl text-[clamp(1rem,1.5vw,1.25rem)] leading-snug t-mute">
        Block what should never leave. Keep everything else.
      </p>
      <Link
        href="/app"
        className="group mt-9 flex items-center gap-3 rounded-lg bg-(color:--t-fg) px-7 py-3.5 text-[15px] font-semibold text-(color:--t-bg) transition-transform duration-300 ease-ios active:scale-[0.98]"
      >
        Open Fragmós
        <span className="transition-transform duration-500 ease-ios group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </Link>
    </div>
  );
}
