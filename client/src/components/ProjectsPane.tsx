import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolioStore } from '../stores/portfolioStore';
import PromptLine from './PromptLine';

export function ProjectsPane({ focused }: { focused?: boolean; }) {
  const { projects } = usePortfolioStore();
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused && scrollRef.current) {
      scrollRef.current.focus();
    }
  }, [focused]);


  if (error) {
    return (
      <div
        role="region"
        aria-label="Projects"
        ref={scrollRef}
        tabIndex={0}
        className="scrollbar-none flex h-full flex-col gap-3 overflow-y-auto outline-none"
      >
        <PromptLine command={"ls -la ~/connection"} />
        <div className="space-y-2 rounded border border-yellow-500/20 bg-yellow-500/[3%] p-3">
          <p className="text-xs text-yellow-400/80" role="alert">
            $ ls: connection refused
          </p>
          <p className="text-xs text-white/30">
            {error}
          </p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-[var(--color-accent)] hover:underline"
          >
            $ retry connection
          </button>
        </div>
        {projects.length > 0 && (
          <div className="flex flex-col gap-2 opacity-60">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group rounded-md border border-white/[7%] bg-white/[3%] p-3 transition-all"
              >
                <span className="text-xs text-white/30">{project.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div
        role="region"
        aria-label="Projects"
        ref={scrollRef}
        tabIndex={0}
        className="scrollbar-none flex h-full flex-col gap-3 overflow-y-auto outline-none"
      >
        <PromptLine command={"ls -la ~/connection"} />
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="font-mono text-sm text-white/40">
            <span className="text-green-400">$</span> ls: no entries yet
          </p>
          <p className="font-mono text-xs text-white/20">
            $ curl --silent --retry 3 --retry-delay 2
          </p>
          <p className="font-mono text-xs text-white/20">
            check back later for project updates
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Projects"
      ref={scrollRef}
      tabIndex={0}
      className="scrollbar-none flex h-full flex-col gap-3 overflow-y-auto outline-none"
    >
      <PromptLine command={"ls -la ~/projects"} />
      <div className="space-y-1 text-xs text-white/30">
        <p>total {projects.length}</p>
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
  );
}
