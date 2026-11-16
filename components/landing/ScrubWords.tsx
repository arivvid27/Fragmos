import type { CSSProperties } from "react";

interface Unit {
  text: string;
  sens: boolean;
  after: string;
}

/**
 * "[Marcus Vance], and every [API key] you paste" becomes words that light up one by one
 * as the nearest ancestor's --p advances. Bracketed text is rendered as sensitive data.
 */
function parse(source: string): Unit[] {
  const units: Unit[] = [];
  const re = /\[([^\]]+)\]([,.;:!?]*)|(\S+)/g;
  for (const m of source.matchAll(re)) {
    if (m[1] !== undefined) {
      units.push({ text: m[1], sens: true, after: m[2] });
    } else {
      units.push({ text: m[3], sens: false, after: "" });
    }
  }
  return units;
}

export function ScrubWords({ text, className = "" }: { text: string; className?: string }) {
  const units = parse(text);
  const n = units.length;
  return (
    <p className={"scrub " + className}>
      {units.map((u, i) => {
        const style = { "--i": (i / n).toFixed(4) } as CSSProperties;
        return (
          <span key={i}>
            <span className="word" style={style}>
              {u.sens ? <span className="sens">{u.text}</span> : u.text}
              {u.after}
            </span>{" "}
          </span>
        );
      })}
    </p>
  );
}
