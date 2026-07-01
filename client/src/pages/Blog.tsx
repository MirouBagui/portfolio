import { useLoaderData } from 'react-router-dom'
import { useState, useMemo } from 'react'
import type { BlogPost } from './blogLoader'
import { usePageMeta } from '../hooks/usePageMeta'
import { usePortfolioStore } from '../stores/portfolioStore'

export function Blog() {
  const posts = useLoaderData() as BlogPost[]
  const { name } = usePortfolioStore()
  const [activeTag, setActiveTag] = useState<string | null>(null)
  usePageMeta(
    `Blog — ${name}`,
    'Thoughts on software engineering, real-time systems, and DevOps.',
  )

  const allTags = useMemo(() => {
    const set = new Set<string>()
    for (const p of posts) p.tags?.forEach((t) => set.add(t))
    return [...set].sort()
  }, [posts])

  const filtered = useMemo(() => {
    if (!activeTag) return posts
    return posts.filter((p) => p.tags?.includes(activeTag))
  }, [posts, activeTag])

  return (
    <section className="flex min-h-screen flex-col items-center px-4 py-24 pt-32">
      <h1 className="mb-4 text-4xl font-bold">
        <span className="text-[var(--color-accent)]">//</span> blog
      </h1>
      <p className="mb-8 text-sm text-white/40">
        $ ls blog/ — {posts.length} post{posts.length !== 1 ? 's' : ''}
      </p>

      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-white/30">{'>'} filter:</span>
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded px-2 py-0.5 font-mono text-[11px] transition-colors ${
              activeTag === null
                ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                : 'bg-white/[5%] text-white/40 hover:text-white/70'
            }`}
          >
            all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded px-2 py-0.5 font-mono text-[11px] transition-colors ${
                activeTag === tag
                  ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                  : 'bg-white/[5%] text-white/40 hover:text-white/70'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="w-full max-w-2xl space-y-6">
        {filtered.length === 0 ? (
          <div className="font-mono text-center text-sm text-white/30">
            <p className="mb-2">
              <span className="text-green-400">$</span> ls blog/ | grep{' '}
              <span className="text-[var(--color-accent)]">{activeTag}</span>
            </p>
            <p className="mb-4">No posts tagged &quot;{activeTag}&quot;</p>
            <button
              onClick={() => setActiveTag(null)}
              className="text-[var(--color-accent)] hover:underline"
            >
              $ clear filter
            </button>
          </div>
        ) : filtered.length < posts.length ? (
          <p className="font-mono text-[11px] text-white/20">
            $ ls: showing {filtered.length} of {posts.length} posts (filtered by{' '}
            <span className="text-[var(--color-accent)]">{activeTag}</span>)
          </p>
        ) : null}

        {filtered.map(({ id, title, excerpt, tags }) => (
          <article
            key={id}
            className="rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20"
          >
            <h2 className="mb-2 text-xl font-semibold text-white/90">
              {title}
            </h2>
            <p className="text-sm text-white/50">{excerpt}</p>
            {tags && tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-white/[5%] px-2 py-0.5 font-mono text-[10px] text-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
