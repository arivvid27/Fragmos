import Link from "next/link";

export function Footer() {
  return (
    <footer
      data-tone="dark"
      className="tone-dark t-bg t-fg border-t t-line px-[clamp(1.25rem,5vw,4.5rem)] py-10"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div>
          <p className="font-serif text-[26px] font-medium tracking-tight">Fragmós</p>
          <p className="mt-1 text-[13px] t-mute">Greek for: Block/Restrict</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-2 text-[13px] t-mute">
          <a href="#entry" className="transition-colors hover:text-(color:--t-fg)">Entry</a>
          <a href="#how" className="transition-colors hover:text-(color:--t-fg)">How it works</a>
          <a href="#try" className="transition-colors hover:text-(color:--t-fg)">Try it</a>
          <a href="#pricing" className="transition-colors hover:text-(color:--t-fg)">Pricing</a>
          <Link href="/app" className="transition-colors hover:text-(color:--t-fg)">Open Fragmós</Link>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-[12px] t-mute">© 2026 Fragmós</p>
    </footer>
  );
}
