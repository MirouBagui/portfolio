import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export function NotFound() {
  usePageMeta('404 — Page Not Found')
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="font-mono text-center">
        <p className="mb-2 text-6xl font-bold text-[var(--color-accent)]">404</p>
        <p className="mb-2 text-sm text-white/60">
          <span className="text-green-400">visitor</span>
          <span className="text-white/40">@</span>
          <span className="text-[var(--color-accent)]">portfolio</span>
          <span className="text-white/40">:$ </span>
          <span>cat /dev/null</span>
        </p>
        <p className="mb-8 text-sm text-red-400/60" role="alert">
          cat: /dev/null: No such file
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg border border-white/10 px-6 py-3 text-sm text-white/60 transition-all hover:border-white/30 hover:text-white"
        >
          cd ~
        </Link>
      </div>
    </section>
  )
}
