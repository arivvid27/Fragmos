"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useScrollProgress } from "./useScrollProgress";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const HEADWORD = "Fragmós".split("");

function speak() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }
  const greek = window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith("el"));
  const say = new SpeechSynthesisUtterance(greek ? "φραγμός" : "frag moss");
  say.lang = greek ? "el-GR" : "en-US";
  say.rate = 0.8;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(say);
}

export function Hero() {
  const ref = useScrollProgress<HTMLElement>("exit");

  const lift: CSSProperties = {
    transform: "translate3d(0, calc(var(--p, 0) * -12vh), 0) scale(calc(1 - var(--p, 0) * 0.08))",
    transformOrigin: "0 40%",
    opacity: "calc(1 - var(--p, 0) * 1.25)",
  };
  const sink: CSSProperties = {
    transform: "translate3d(0, calc(var(--p, 0) * -22vh), 0)",
    opacity: "calc(1 - var(--p, 0) * 1.6)",
  };

  return (
    <section
      id="top"
      ref={ref}
      data-tone="light"
      className="tone-light t-bg t-fg relative flex min-h-svh flex-col overflow-hidden px-[clamp(1.25rem,5vw,4.5rem)] pb-8 pt-24"
    >
      <div className="flex flex-1 flex-col justify-center">
        <div style={lift}>
          <div className="mb-[clamp(0.5rem,2vw,1.5rem)] flex flex-wrap items-center gap-x-5 gap-y-2 pl-[0.4vw]">
            <span className="font-mono text-[14px] t-mute">φραγμός</span>
            <span className="font-serif text-[18px] italic t-mute">noun</span>
            <span className="font-mono text-[14px] t-mute">/fraɣˈmos/</span>
            <button
              type="button"
              onClick={speak}
              aria-label="Hear the word"
              className="flex h-8 w-8 items-center justify-center rounded-full border t-line t-mute transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-white"
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden>
                <path d="M3 8v4h3l4 3V5L6 8H3Z" strokeLinejoin="round" />
                <path d="M13 7.5a3.5 3.5 0 0 1 0 5M15.5 5a7 7 0 0 1 0 10" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <h1
            aria-label="Fragmós"
            className="font-serif text-[clamp(5.2rem,23.5vw,27rem)] font-light leading-[0.86] tracking-[-0.055em]"
          >
            {HEADWORD.map((ch, i) => (
              <span key={i} aria-hidden className="hw-letter" style={{ "--i": i } as CSSProperties}>
                {ch}
              </span>
            ))}
          </h1>
        </div>

        <div
          style={sink}
          className="mt-[clamp(1.5rem,3.5vw,3rem)] grid items-start gap-x-12 gap-y-8 pl-[0.4vw] md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto]"
        >
          <p className="text-[clamp(1.05rem,1.6vw,1.4rem)] leading-snug t-mute">
            Greek for: <span className="t-fg">Block/Restrict</span>
          </p>
          <ol className="space-y-3 text-[15px] leading-relaxed">
            <li className="flex gap-4">
              <span className="font-serif text-[18px] italic t-mute">1.</span>
              <span>A fence set between sensitive data and an AI model.</span>
            </li>
            <li className="flex gap-4">
              <span className="font-serif text-[18px] italic t-mute">2.</span>
              <span>The tool that builds it, in your browser, before anything is sent.</span>
            </li>
          </ol>
          <div className="flex items-center gap-6">
            <Link
              href="/app"
              className="group flex items-center gap-3 rounded-lg bg-forest px-6 py-3 text-[14px] font-semibold text-white transition-[background-color,transform] duration-300 ease-ios hover:bg-forest-deep active:scale-[0.98]"
            >
              Open Fragmós
              <span className="transition-transform duration-500 ease-ios group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </Link>
            <a href="#entry" className="text-[14px] underline-offset-4 t-mute transition-colors hover:text-forest hover:underline">
              Read the entry
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between text-[12px] t-mute">
        <div className="flex items-center gap-3">
          <span className="cue-line relative block h-10 w-px overflow-hidden bg-(color:--t-line)" />
          Scroll
        </div>
        <span className="hidden md:block">Free for personal and education use</span>
      </div>

      <div
        aria-hidden
        className="absolute right-[clamp(0.5rem,1.4vw,1.4rem)] top-1/2 hidden -translate-y-1/2 flex-col items-center gap-[7px] font-mono text-[10px] t-mute xl:flex"
      >
        {ALPHABET.map((l) => (
          <span
            key={l}
            className={
              l === "F"
                ? "flex h-5 w-5 items-center justify-center rounded-[4px] bg-forest font-semibold text-white"
                : "opacity-60"
            }
          >
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}
