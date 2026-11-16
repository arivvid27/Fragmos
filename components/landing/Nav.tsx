"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#entry", label: "Entry" },
  { href: "#how", label: "How it works" },
  { href: "#try", label: "Try it" },
  { href: "#pricing", label: "Pricing" },
];

/**
 * Fixed bar that follows the page tone. Every region that has a tone carries data-tone,
 * and the bar adopts whichever one is under it.
 */
export function Nav() {
  const [tone, setTone] = useState<"light" | "dark">("light");
  const [shown, setShown] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    function read() {
      raf.current = 0;
      // The full screen hero stands alone. The bar slides in once most of it has scrolled away.
      const past = window.scrollY > window.innerHeight * 0.65;
      setShown((cur) => (cur === past ? cur : past));
      const regions = document.querySelectorAll<HTMLElement>("[data-tone]");
      const y = 32;
      for (let i = 0; i < regions.length; i++) {
        const r = regions[i].getBoundingClientRect();
        if (r.top <= y && r.bottom > y) {
          const next = regions[i].dataset.tone === "dark" ? "dark" : "light";
          setTone((cur) => (cur === next ? cur : next));
          return;
        }
      }
    }
    function onScroll() {
      if (!raf.current) {
        // Read twice: the second pass runs after the transitions have updated their own tone.
        raf.current = requestAnimationFrame(() => {
          read();
          raf.current = requestAnimationFrame(read);
        });
      }
    }
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const dark = tone === "dark";

  return (
    <header
      inert={!shown}
      style={{ backgroundColor: "color-mix(in srgb, var(--t-bg) 80%, transparent)" }}
      className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-[transform,opacity,background-color,color] duration-700 ease-ios ${
        shown ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${dark ? "tone-dark" : "tone-light"} t-fg`}
    >
      <div className="flex h-16 items-center justify-between px-[clamp(1.25rem,5vw,4.5rem)]">
        <a href="#top" className="font-serif text-[26px] font-medium tracking-tight">
          Fragmós
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-9 text-[13px] md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="t-mute transition-colors duration-300 hover:text-(color:--t-fg)">
              {l.label}
            </a>
          ))}
        </nav>
        <Link
          href="/app"
          className={`rounded-lg px-4 py-2 text-[13px] font-semibold transition-[background-color,color,transform] duration-500 ease-ios active:scale-[0.97] ${
            dark ? "bg-canvas text-ink hover:bg-token" : "bg-forest text-white hover:bg-forest-deep"
          }`}
        >
          Open Fragmós
        </Link>
      </div>
    </header>
  );
}
