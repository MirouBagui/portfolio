// PROTOTYPE — throwaway (#13). Variant C "Result-first spreads": each case study is a full-width
// spread that LEADS with its result figures as the headline, then a sticky diagram beside the
// scrolling problem/decisions. Anatomy reordered: result → problem → decisions, diagram alongside.
import { CASE_STUDIES, INTRO } from './content';
import { Decisions, Figures, Label, Trace } from './parts';

export function VariantC() {
  return (
    <div>
      <header className="mx-auto mb-16 max-w-[1200px] px-6 text-center sm:px-12 lg:px-[72px]">
        <p className="mb-3.5 font-mono text-xs tracking-[2.5px] text-accent">// ARCHITECTURE</p>
        <h1 className="mx-auto mb-4 max-w-[760px] text-[clamp(34px,3.8vw,52px)] font-bold tracking-[-1.5px]">What breaks first under pressure?</h1>
        <p className="mx-auto max-w-[560px] text-base leading-relaxed text-text-muted">{INTRO.lede}</p>
        <nav aria-label="Case studies" className="mt-8 flex flex-wrap justify-center gap-2 font-mono text-xs">
          {CASE_STUDIES.map((cs) => (
            <a key={cs.id} href={`#${cs.id}`} className="rounded-full border border-border px-3.5 py-1.5 text-text-muted no-underline hover:border-accent hover:text-accent">
              #{cs.tag.toLowerCase()}
            </a>
          ))}
        </nav>
      </header>

      {CASE_STUDIES.map((cs, i) => (
        <article key={cs.id} id={cs.id} className="scroll-mt-20 border-t border-border py-20">
          <div className="mx-auto max-w-[1200px] px-6 sm:px-12 lg:px-[72px]">
            <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Label>{String(i + 1).padStart(2, '0')} // {cs.tag.toUpperCase()}</Label>
                <h2 className="max-w-[560px] text-[clamp(26px,2.6vw,36px)] font-bold tracking-[-1px]">{cs.title}</h2>
                <p className="mt-2 font-mono text-xs text-text-muted">{cs.role}</p>
              </div>
              <div className="lg:text-right">
                <Figures cs={cs} big />
                <p className="mt-3 text-sm text-text-muted">{cs.resultNote}</p>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-16">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <Trace cs={cs} />
                <details className="mt-3 font-mono text-xs text-text-muted">
                  <summary className="cursor-pointer text-accent">$ cat diagram.txt</summary>
                  <p className="mt-2 font-sans text-sm leading-relaxed">{cs.diagramText}</p>
                </details>
              </div>
              <div>
                <Label>// PROBLEM</Label>
                <p className="mb-8 text-[17px] leading-relaxed text-text-primary">{cs.problem}</p>
                <Label>// KEY DECISIONS</Label>
                <Decisions cs={cs} />
              </div>
            </div>
          </div>
        </article>
      ))}

      <p className="mx-auto max-w-[640px] border-t border-border px-6 pt-10 text-center text-[15px] italic leading-relaxed text-text-muted">{INTRO.closing}</p>
    </div>
  );
}
