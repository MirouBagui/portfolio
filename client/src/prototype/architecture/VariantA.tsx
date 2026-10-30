// PROTOTYPE — throwaway (#13). Variant A "Long read": a sticky index on the left (desktop),
// three case studies stacked in one reading column, strict anatomy
// problem → decisions → diagram → result. diagramText shown as visible text under the trace.
import { CASE_STUDIES, INTRO } from './content';
import { Decisions, Figures, Label, Trace } from './parts';

export function VariantA() {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-12 px-6 sm:px-12 lg:grid-cols-[220px_1fr] lg:px-[72px]">
      <nav aria-label="Case studies" className="hidden lg:block">
        <ol className="sticky top-28 m-0 flex list-none flex-col gap-4 p-0 font-mono text-xs">
          {CASE_STUDIES.map((cs, i) => (
            <li key={cs.id}>
              <a href={`#${cs.id}`} className="group block text-text-muted no-underline hover:text-accent">
                <span className="text-accent">{String(i + 1).padStart(2, '0')}</span> {cs.tag.toLowerCase()}
                <span className="mt-0.5 block font-sans text-[13px] text-text-primary group-hover:text-accent">{cs.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="max-w-[720px]">
        <header className="mb-20">
          <p className="mb-3 font-mono text-xs text-[var(--color-status-pass)]">$ <span className="text-text-primary">{INTRO.prompt}</span></p>
          <h1 className="mb-4 text-[clamp(38px,4vw,56px)] font-bold tracking-[-2px]">{INTRO.title}</h1>
          <p className="text-lg leading-relaxed text-text-muted">{INTRO.lede}</p>
        </header>

        {CASE_STUDIES.map((cs, i) => (
          <article key={cs.id} id={cs.id} className="mb-24 scroll-mt-24">
            <Label>{String(i + 1).padStart(2, '0')} // {cs.tag.toUpperCase()}</Label>
            <h2 className="mb-2 text-[clamp(26px,2.6vw,34px)] font-bold tracking-[-1px]">{cs.title}</h2>
            <p className="mb-8 font-mono text-xs text-text-muted">{cs.role}</p>

            <Label>// PROBLEM</Label>
            <p className="mb-8 text-[15px] leading-relaxed text-text-muted">{cs.problem}</p>

            <Label>// KEY DECISIONS</Label>
            <div className="mb-8"><Decisions cs={cs} /></div>

            <Trace cs={cs} className="mb-3" />
            <p className="mb-8 text-sm leading-relaxed text-text-muted">{cs.diagramText}</p>

            <Label>// RESULT</Label>
            <Figures cs={cs} />
            <p className="mt-3 text-sm text-text-muted">{cs.resultNote}</p>
          </article>
        ))}

        <p className="border-t border-border pt-8 text-[15px] italic leading-relaxed text-text-muted">{INTRO.closing}</p>
      </div>
    </div>
  );
}
