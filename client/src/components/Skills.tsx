import { useMemo } from 'react';
import { usePortfolioStore } from '../stores/portfolioStore';

export function Skills() {
  const { aboutParagraphs } = usePortfolioStore();
  const { projects } = usePortfolioStore();
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) p.tech?.forEach((t) => set.add(t));
    return [...set];
  }, [projects]);

  return (
    <section
      id="skills"
      className="flex flex-col items-center justify-center px-4 py-24 scroll-mt-24"
    >
      <div className="max-w-2xl text-center">
        <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
          <span className="text-[var(--color-accent)]">#</span> What I Do
        </h2>
        <div className="space-y-4 text-left text-white/60">
          {aboutParagraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] text-white/20">tags:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                className="rounded bg-white/[5%] px-2 py-0.5 font-mono text-[11px] text-white/30 transition-colors hover:text-white/60"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
