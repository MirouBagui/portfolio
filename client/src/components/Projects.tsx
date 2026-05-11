import { Link } from 'react-router-dom'
import { useState, useMemo, type KeyboardEvent } from 'react'
import { usePortfolioStore } from '../stores/portfolioStore'

export function Projects() {
  const { projects } = usePortfolioStore()
  const [filter, setFilter] = useState('')
  const [filterInput, setFilterInput] = useState('')

  const allTags = useMemo(() => {
    const set = new Set<string>()
    for (const p of projects) p.tech?.forEach((t) => set.add(t))
    return [...set].sort()
  }, [projects])

  const filtered = useMemo(() => {
    if (!filter) return projects
    const lower = filter.toLowerCase()
    return projects.filter(
      (p) =>
        p.tech?.some((t) => t.toLowerCase().includes(lower)) ||
        p.title.toLowerCase().includes(lower),
    )
  }, [projects, filter])

  const handleFilterKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilter(filterInput.trim())
    }
    if (e.key === 'Escape') {
      setFilterInput('')
      setFilter('')
    }
  }

  return (
    <section
      id="projects"
      className="flex min-h-screen flex-col items-center px-4 py-24 scroll-mt-24"
    >
      <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
        <span className="text-[var(--color-accent)]">//</span> projects
      </h2>
      <p className="mb-2 font-mono text-xs text-white/30">
        visitor@portfolio:~$ ls -la ~/projects | wc -l
      </p>
      <p className="mb-8 font-mono text-xs text-white/20">{projects.length}</p>

      <div className="mb-8 flex w-full max-w-xl items-center gap-2 font-mono text-xs">
        <span className="text-green-400">$</span>
        <span className="text-white/40">ls --filter=</span>
        <input
          type="text"
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          onKeyDown={handleFilterKeyDown}
          placeholder={filter || 'tag name (Enter to filter, Esc to clear)'}
          className="flex-1 bg-transparent text-white/70 outline-none placeholder:text-white/15"
          aria-label="Filter projects by tech tag"
        />
        {filter && (
          <button
            onClick={() => {
              setFilterInput('')
              setFilter('')
            }}
            className="text-white/30 hover:text-white/60"
            aria-label="Clear filter"
          >
            &times;
          </button>
        )}
      </div>

      {allTags.length > 0 && !filter && (
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] text-white/20">tags:</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setFilterInput(tag)
                setFilter(tag)
              }}
              className="rounded bg-white/[5%] px-2 py-0.5 font-mono text-[11px] text-white/30 transition-colors hover:text-white/60"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="font-mono text-center text-sm text-white/30">
          <p className="mb-1">
            <span className="text-green-400">$</span> ls --filter=
            <span className="text-[var(--color-accent)]">{filter}</span>
          </p>
          <p className="mb-1">ls: no entries match filter &quot;{filter}&quot;</p>
          <button
            onClick={() => {
              setFilterInput('')
              setFilter('')
            }}
            className="text-[var(--color-accent)] hover:underline"
          >
            $ clear filter
          </button>
        </div>
      ) : (
        <>
          {filter && (
            <p className="mb-4 font-mono text-[11px] text-white/20">
              $ ls: {filtered.length} of {projects.length} entries match &quot;
              <span className="text-[var(--color-accent)]">{filter}</span>&quot;
            </p>
          )}
          <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-2">
            {filtered.map(({ id, title, description, tech }) => (
              <Link
                key={id}
                to={`/projects/${id}`}
                className="group rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:border-[var(--color-accent)]/50 hover:bg-white/10"
              >
                <h3 className="mb-2 font-semibold text-white/90 transition-colors group-hover:text-[var(--color-accent)]">
                  {title}
                </h3>
                <p className="mb-3 text-sm text-white/50">{description}</p>
                {tech && (
                  <div className="flex flex-wrap gap-1.5">
                    {tech.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-white/[5%] px-2 py-0.5 font-mono text-[11px] text-[var(--color-accent)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
