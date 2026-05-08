import { useLoaderData } from 'react-router-dom'
import type { BlogPost } from './blogLoader'

export function Blog() {
  const posts = useLoaderData() as BlogPost[]

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 py-24 pt-32">
      <h1 className="mb-12 text-4xl font-bold">
        <span className="text-[var(--color-accent)]">#</span> Blog
      </h1>

      <div className="w-full max-w-2xl space-y-6">
        {posts.map(({ id, title, excerpt }) => (
          <article
            key={id}
            className="rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20"
          >
            <h2 className="mb-2 text-xl font-semibold text-white/90">{title}</h2>
            <p className="text-sm text-white/50">{excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
