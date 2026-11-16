import { Reveal } from "./Reveal";

const SENSES = [
  {
    pos: "noun",
    text: "A barrier between sensitive data and an AI model.",
    example: "We put a fragmós between the student file and the chatbot.",
  },
  {
    pos: "noun",
    text: "The step that swaps names, IDs, contacts, and secrets for placeholder tokens, while the originals stay in memory on your device.",
    example: "Her name left as [SUBJECT_1] and came back as her name.",
  },
  {
    pos: "proper noun",
    text: "A browser tool that does all of the above in milliseconds, then asks Gemini, Claude, or GPT on your behalf.",
    example: "Run it through Fragmós first.",
  },
];

export function Entry() {
  return (
    <section
      id="entry"
      data-tone="light"
      className="tone-light t-bg t-fg relative px-[clamp(1.25rem,5vw,4.5rem)] py-[clamp(6rem,14vw,13rem)]"
    >
      <div className="mx-auto grid max-w-6xl gap-x-20 gap-y-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="self-start lg:sticky lg:top-28">
          <Reveal>
            <p className="text-[12px] uppercase tracking-[0.18em] t-mute">Entry</p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="mt-5 font-serif text-[clamp(3.4rem,8vw,7rem)] font-light leading-none tracking-[-0.045em]">
              frag·mós
            </h2>
          </Reveal>
          <Reveal delay={180} className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-serif text-[20px] italic t-mute">noun</span>
            <span className="font-mono text-[14px] t-mute">/fraɣˈmos/</span>
          </Reveal>
          <Reveal delay={260} className="mt-10 max-w-sm border-t t-line pt-5">
            <p className="text-[11px] uppercase tracking-[0.18em] t-mute">Origin</p>
            <p className="mt-3 text-[15px] leading-relaxed">
              From Greek <span className="font-mono text-[13px]">φραγμός</span> (phragmós), a fence, a hedge, a partition.
              Related to <span className="font-mono text-[13px]">φράσσω</span>, to enclose or to block.
            </p>
          </Reveal>
        </div>

        <ol className="space-y-[clamp(3.5rem,7vw,6rem)]">
          {SENSES.map((s, i) => (
            <Reveal key={i} as="li" className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
              <span className="font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-none t-mute">{i + 1}</span>
              <div>
                <p className="font-serif text-[15px] italic t-mute">{s.pos}</p>
                <p className="mt-2 font-serif text-[clamp(1.6rem,2.9vw,2.5rem)] leading-[1.18] tracking-tight">{s.text}</p>
                <p className="mt-4 font-serif text-[clamp(1.05rem,1.4vw,1.25rem)] italic t-mute">“{s.example}”</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
