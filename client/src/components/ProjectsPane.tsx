import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { usePortfolioStore } from '../stores/portfolioStore'

export function ProjectsPane({ focused }: { focused?: boolean }) {
  const { projects } = usePortfolioStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (focused && scrollRef.current) {
      scrollRef.current.focus()
    }
  }, [focused])

  return (
    <div
      role="region"
      aria-label="Projects"
      ref={scrollRef}
      tabIndex={0}
      className="scrollbar-none flex h-full flex-col gap-3 overflow-y-auto outline-none"
    >
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <span className="text-green-400">visitor</span>
        <span className="text-white/30">@</span>
        <span className="text-[var(--color-accent)]">portfolio</span>
        <span className="text-white/30">:</span>
        <span className="text-cyan-400">~</span>
        <span className="text-white/30">$</span>
        <span className="ml-1 text-xs text-white/50">
          ls -la ~/projects
        </span>
      </div>

      <div className="space-y-1 text-xs text-white/30">
        <p>total {projects.length}</p>
        <p>drwxr-xr-x 1 visitor portfolio 128 May 8 20:48 .</p>
        <p>drwxr-xr-x 1 visitor portfolio 256 May 8 20:48 ..</p>
      </div>

      <div className="flex flex-col gap-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="group rounded-md border border-white/[7%] bg-white/[3%] p-3 transition-all hover:border-[var(--color-accent)]/30 hover:bg-white/[6%]"
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-xs text-[var(--color-accent)] transition-transform group-hover:translate-x-0.5">
                ▶
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="truncate text-sm font-medium text-white/80 transition-colors group-hover:text-[var(--color-accent)]">
                    {project.title}
                  </span>
                  <span className="shrink-0 text-[11px] text-white/20">
                    ./project-{project.id}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/40">
                  {project.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
