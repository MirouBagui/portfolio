// PROTOTYPE — throwaway (#13). Variant B "ls -l index": the page opens on an `ls -l`-style listing
// of the three case studies with their headline figure; one case study is open at a time below,
// laid out problem+decisions | diagram+result. The hash selects which is open. diagramText in <details>.
import { useLocation, useNavigate } from 'react-router-dom';
import { CASE_STUDIES, INTRO } from './content';
import { Decisions, Figures, Label, Trace } from './parts';

export function VariantB() {
  const { hash, search } = useLocation();
  const nav = useNavigate();
  const openId = CASE_STUDIES.find((c) => `#${c.id}` === hash)?.id ?? CASE_STUDIES[0].id;
  const cs = CASE_STUDIES.find((c) => c.id === openId)!;

  return (
    <div className="mx-auto max-w-[1200px] px-6 sm:px-12 lg:px-[72px]">
      <header className="mb-10">
        <p className="mb-3 font-mono text-xs text-[var(--color-status-pass)]">$ <span className="text-text-primary">ls -l architecture/</span></p>
        <h1 className="mb-3 text-[clamp(34px,3.5vw,48px)] font-bold tracking-[-1.5px]">{INTRO.title}</h1>
        <p className="max-w-[640px] text-base leading-relaxed text-text-muted">{INTRO.lede}</p>
      </header>

      <ul className="m-0 mb-12 list-none overflow-hidden rounded-lg border border-border bg-surface p-0 font-mono text-xs">
        <li aria-hidden className="hidden grid-cols-[48px_130px_1fr_150px] gap-4 border-b border-border px-5 py-2.5 text-[10px] tracking-[1.5px] text-text-muted md:grid">
          <span>#</span><span>FOCUS</span><span>CASE STUDY</span><span className="text-right">HEADLINE</span>
        </li>
        {CASE_STUDIES.map((c, i) => {
          const open = c.id === openId;
          return (
            <li key={c.id} className="border-b border-border last:border-b-0">
              <button
                onClick={() => nav({ search, hash: c.id }, { replace: true, preventScrollReset: true })}
                aria-expanded={open}
                aria-controls="cs-panel"
                className={`grid w-full grid-cols-[32px_1fr] gap-x-4 gap-y-1 px-5 py-3.5 text-left md:grid-cols-[48px_130px_1fr_150px] md:items-center ${open ? 'bg-accent/[8%]' : 'hover:bg-white/[3%]'}`}
              >
                <span className="text-accent">{open ? '▸' : ' '}{String(i + 1).padStart(2, '0')}</span>
                <span className="text-text-muted md:order-none">{c.tag.toLowerCase()}</span>
                <span className="col-span-2 font-sans text-[15px] text-text-primary md:col-span-1">{c.title}</span>
                <span className="col-span-2 text-accent-hover md:col-span-1 md:text-right">{c.results[0].value} {c.results[0].label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <article id="cs-panel" key={cs.id} className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <Label>{cs.tag.toUpperCase()} // {cs.id}</Label>
          <h2 className="mb-2 text-[clamp(24px,2.4vw,32px)] font-bold tracking-[-1px]">{cs.title}</h2>
          <p className="mb-7 font-mono text-xs text-text-muted">{cs.role}</p>
          <Label>// PROBLEM</Label>
          <p className="mb-7 text-[15px] leading-relaxed text-text-muted">{cs.problem}</p>
          <Label>// KEY DECISIONS</Label>
          <Decisions cs={cs} />
        </div>
        <div>
          <Trace cs={cs} />
          <details className="mt-3 font-mono text-xs text-text-muted">
            <summary className="cursor-pointer text-accent">$ cat diagram.txt</summary>
            <p className="mt-2 font-sans text-sm leading-relaxed">{cs.diagramText}</p>
          </details>
          <div className="mt-8">
            <Label>// RESULT</Label>
            <Figures cs={cs} />
            <p className="mt-3 text-sm text-text-muted">{cs.resultNote}</p>
          </div>
        </div>
      </article>

      <p className="mt-20 border-t border-border pt-8 text-[15px] italic leading-relaxed text-text-muted">{INTRO.closing}</p>
    </div>
  );
}
