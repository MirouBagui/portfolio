import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { CaseStudyConfig } from '../portfolio.config';
import { usePortfolioStore } from '../stores/portfolioStore';
import { usePageMeta } from '../hooks/usePageMeta';

// Results-first layout (ADR-0005). Copy comes from config (ADR-0007); figures from the map (ADR-0002).

const Label = ({ children }: { children: ReactNode }) => (
  <p className="mb-2.5 font-mono text-[10px] tracking-[2px] text-accent">{children}</p>
);

function ResultFigures({ cs }: { cs: CaseStudyConfig }) {
  const figures = usePortfolioStore((s) => s.figures);
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 lg:flex-nowrap lg:justify-end">
      {cs.result.figures.map((id) => (
        <div key={id}>
          <p className="font-mono text-[clamp(36px,4.5vw,60px)] font-semibold leading-none tracking-[-2px] text-text-primary">
            {figures[id].value}
          </p>
          <p className="mt-1 font-mono text-[10px] tracking-[1.5px] text-text-muted">{figures[id].label.toUpperCase()}</p>
        </div>
      ))}
    </div>
  );
}

function CaseStudySection({ cs, index }: { cs: CaseStudyConfig; index: number }) {
  return (
    <article id={cs.id} aria-labelledby={`${cs.id}-title`} className="scroll-mt-20 border-t border-border py-20">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-12 lg:px-[72px]">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Label>
              {String(index + 1).padStart(2, '0')} // {cs.tag.toUpperCase()}
            </Label>
            <h2 id={`${cs.id}-title`} className="max-w-[560px] text-[clamp(26px,2.6vw,36px)] font-bold tracking-[-1px]">
              {cs.title}
            </h2>
            <p className="mt-2 font-mono text-xs text-text-muted">{cs.roleLine}</p>
          </div>
          <div className="lg:shrink-0 lg:text-right">
            <ResultFigures cs={cs} />
            <p className="mt-3 text-sm text-text-muted">{cs.result.text}</p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            {/* Diagram slot: the terminal trace for cs.diagram mounts here (#23). */}
            <details className="mt-3 font-mono text-xs text-text-muted">
              <summary className="cursor-pointer text-accent">$ cat diagram.txt</summary>
              <p className="mt-2 font-sans text-sm leading-relaxed">{cs.diagramText}</p>
            </details>
          </div>
          <div>
            <Label>// PROBLEM</Label>
            <p className="mb-8 text-[17px] leading-relaxed text-text-primary">{cs.problem}</p>
            <Label>// KEY DECISIONS</Label>
            <dl className="m-0 flex flex-col gap-3">
              {cs.decisions.map((d) => (
                <div key={d.term} className="text-[15px] leading-relaxed">
                  <dt className="inline font-semibold text-text-primary">{d.term}</dt>{' '}
                  <dd className="m-0 inline text-text-muted">{d.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Architecture() {
  const { name, caseStudies, architecturePage: page } = usePortfolioStore();
  usePageMeta(`Architecture — ${name}`, page.intro);

  return (
    <main className="pb-24 pt-32">
      <header className="mx-auto mb-16 max-w-[1200px] px-6 text-center sm:px-12 lg:px-[72px]">
        <p className="mb-3.5 font-mono text-xs tracking-[2.5px] text-accent">// ARCHITECTURE</p>
        <h1 className="mx-auto mb-4 max-w-[760px] text-[clamp(34px,3.8vw,52px)] font-bold tracking-[-1.5px]">
          {page.headline}
        </h1>
        <p className="mx-auto max-w-[560px] text-base leading-relaxed text-text-muted">{page.intro}</p>
        <nav aria-label="Case studies" className="mt-8 flex flex-wrap justify-center gap-2 font-mono text-xs">
          {caseStudies.map((cs) => (
            <Link
              key={cs.id}
              to={`#${cs.id}`}
              className="rounded-full border border-border px-3.5 py-1.5 text-text-muted no-underline hover:border-accent hover:text-accent"
            >
              #{cs.tag.toLowerCase()}
            </Link>
          ))}
        </nav>
      </header>

      {caseStudies.map((cs, i) => (
        <CaseStudySection key={cs.id} cs={cs} index={i} />
      ))}

      <p className="mx-auto max-w-[640px] border-t border-border px-6 pt-10 text-center text-[15px] italic leading-relaxed text-text-muted">
        {page.closing}
      </p>
    </main>
  );
}
