import { Link } from 'react-router-dom';
import { usePortfolioStore } from '../stores/portfolioStore';
import { useReveal, revealClass } from '../hooks/useReveal';

/**
 * Home teaser for /architecture (ADR-0006): reads caseStudies, figures and architecturePage
 * from the store so it cannot drift from the page (ADR-0002). No diagram, and no import from
 * the diagram registry, so trace code stays off the home bundle.
 */
export function ArchitectureTeaser() {
  const { caseStudies, figures, architecturePage } = usePortfolioStore();
  const [ref, shown] = useReveal<HTMLDivElement>(0);

  return (
    <section id="architecture" className="relative z-[1] scroll-mt-16 py-[120px]" aria-labelledby="architecture-teaser-title">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-12 lg:px-[72px]">
        <div className="mb-12">
          <p className="mb-3.5 font-mono text-xs tracking-[2.5px] text-accent">// ARCHITECTURE</p>
          <h2 id="architecture-teaser-title" className="text-[clamp(34px,3.5vw,52px)] font-bold tracking-[-1.5px]">
            {architecturePage.headline}
          </h2>
          <p className="mt-3 text-text-muted">{architecturePage.teaser.subtitle}</p>
        </div>

        <div ref={ref} className={revealClass(shown)}>
          <ul className="border-t border-border">
            {caseStudies.map((cs, i) => {
              const lead = figures[cs.result.figures[0]];
              return (
                <li key={cs.id} className="border-b border-border">
                  <Link
                    to={`/architecture#${cs.id}`}
                    className="group grid grid-cols-1 gap-x-8 gap-y-1.5 py-6 sm:grid-cols-[1fr_auto] sm:items-baseline lg:grid-cols-[170px_1fr_auto]"
                  >
                    <span className="font-mono text-xs tracking-[2px] text-accent sm:col-span-2 lg:col-span-1">
                      {String(i + 1).padStart(2, '0')} // {cs.tag.toUpperCase()}
                    </span>
                    <span className="text-lg font-semibold text-text-primary transition-colors group-hover:text-accent-hover sm:text-xl">
                      {cs.title}
                    </span>
                    <span className="font-mono text-sm whitespace-nowrap text-text-muted">
                      <span className="text-text-primary">{lead.value}</span> {lead.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            to="/architecture"
            className="mt-8 inline-flex min-h-11 items-center font-mono text-sm text-accent transition-colors hover:text-accent-hover"
          >
            {architecturePage.teaser.linkText}
          </Link>
        </div>
      </div>
    </section>
  );
}
