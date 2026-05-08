import { usePortfolioStore } from '../stores/portfolioStore'

export function WhoAmIPane() {
  const { name, role, tagline, skills } = usePortfolioStore()

  return (
    <div
      role="region"
      aria-label="Who am I"
      className="flex h-full flex-col gap-4"
    >
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <span className="text-green-400">visitor</span>
        <span className="text-white/30">@</span>
        <span className="text-[var(--color-accent)]">portfolio</span>
        <span className="text-white/30">:</span>
        <span className="text-cyan-400">~</span>
        <span className="text-white/30">$</span>
        <span className="ml-1 text-xs text-white/50">cat whoami</span>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-white/40">name:</p>
        <h1 className="text-lg font-bold tracking-tight text-white">
          {name}
        </h1>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-white/40">role:</p>
        <p className="text-sm text-[var(--color-accent)]">{role}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-white/40">bio:</p>
        <p className="text-xs leading-relaxed text-white/50">{tagline}</p>
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex items-center gap-2 border-t border-white/10 pt-3">
          <span className="text-green-400">visitor</span>
          <span className="text-white/30">@</span>
          <span className="text-[var(--color-accent)]">portfolio</span>
          <span className="text-white/30">:</span>
          <span className="text-cyan-400">~</span>
          <span className="text-white/30">$</span>
          <span className="ml-1 text-xs text-white/50">skills --list</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span
              key={s}
              className="rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-[var(--color-accent)]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
