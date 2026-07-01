import { usePortfolioStore } from '../stores/portfolioStore';
import { useReveal, revealClass } from '../hooks/useReveal';
import { ACCENTS, rgba } from './accents';
import type { SkillCategoryConfig } from '../portfolio.config';

function SkillCard({ cat, delay }: { cat: SkillCategoryConfig; delay: number }) {
  const [ref, shown] = useReveal<HTMLDivElement>(delay);
  const a = ACCENTS[cat.accent];

  return (
    <div
      ref={ref}
      className={`rounded-[14px] border p-8 backdrop-blur-sm ${revealClass(shown)}`}
      style={{ background: 'rgba(10,16,28,.8)', borderColor: rgba(cat.accent, 0.12) }}
    >
      <div className="mb-7 flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-base"
          style={{ background: rgba(cat.accent, 0.1), border: `1px solid ${rgba(cat.accent, 0.2)}`, color: a.barTo }}
        >
          {cat.icon}
        </div>
        <div>
          <p className="text-[15px] font-semibold">{cat.title}</p>
          <p className="mt-px font-mono text-[11px] text-[#334155]">{cat.subtitle}</p>
        </div>
      </div>

      {cat.skills.map((s) => (
        <div key={s.name} className="mb-[18px] last:mb-0">
          <div className="mb-1.5 flex justify-between font-mono text-xs">
            <span className="text-[#94a3b8]">{s.name}</span>
            <span style={{ color: a.light }}>{s.pct}%</span>
          </div>
          <div className="h-[3px] overflow-hidden rounded-sm bg-white/5">
            <div
              className="h-full rounded-sm transition-[width] duration-[1300ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
              style={{
                width: shown ? `${s.pct}%` : '0%',
                background: `linear-gradient(90deg,${a.barFrom},${a.barTo})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Skills() {
  const { skillCategories } = usePortfolioStore();

  return (
    <section id="skills" className="relative z-[1] scroll-mt-16 py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-12 lg:px-[72px]">
        <div className="mb-[72px] text-center">
          <p className="mb-3.5 font-mono text-xs tracking-[2.5px] text-[var(--color-accent)]">// EXPERTISE</p>
          <h2 className="text-[clamp(34px,3.5vw,52px)] font-bold tracking-[-1.5px]">Technical Stack</h2>
          <p className="mx-auto mt-3.5 max-w-[520px] text-base leading-relaxed text-[#475569]">
            Full-stack expertise across the entire lifecycle — from architecture to production.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {skillCategories.map((cat, i) => (
            <SkillCard key={cat.title} cat={cat} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
