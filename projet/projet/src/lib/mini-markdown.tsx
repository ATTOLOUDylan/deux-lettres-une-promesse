import type { ReactNode } from "react";

// Safe tiny Markdown renderer: headings (#), paragraphs, **bold**, *italic*. Produces React nodes only.
function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) out.push(<strong key={`${key}-${i++}`}>{t.slice(2, -2)}</strong>);
    else out.push(<em key={`${key}-${i++}`}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function MiniMarkdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return (
    <div className="parchment-prose">
      {blocks.map((b, i) => {
        const h = /^(#{1,3})\s+(.*)$/.exec(b.trim());
        if (h) return <h3 key={i}>{inline(h[2], `h${i}`)}</h3>;
        const whole = /^\*[^*].*[^*]\*$/.test(b.trim());
        return (
          <p key={i} className={whole ? "poetic" : undefined}>
            {inline(b.replace(/\n/g, " "), `p${i}`)}
          </p>
        );
      })}
    </div>
  );
}
