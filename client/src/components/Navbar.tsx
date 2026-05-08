import { Link, useLocation } from 'react-router-dom'
import { match } from 'ts-pattern'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/#about', label: 'About' },
  { to: '/#projects', label: 'Projects' },
  { to: '/#contact', label: 'Contact' },
  { to: '/blog', label: 'Blog' },
]

export function Navbar() {
  const location = useLocation()

  return (
    <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-[var(--color-bg-primary)]/80 px-6 py-4 backdrop-blur-md sm:px-12">
      <Link to="/" className="text-lg font-bold tracking-tight">
        <span className="text-[var(--color-accent)]">&lt;</span>
        Portfolio
        <span className="text-[var(--color-accent)]"> /&gt;</span>
      </Link>

      <div className="flex items-center gap-6">
        {LINKS.map(({ to, label }) => {
          const isActive = match({ path: location.pathname + location.hash })
            .with({ path: to }, () => true)
            .otherwise(() => false)

          return (
            <Link
              key={label}
              to={to}
              className={`text-sm transition-colors ${
                isActive
                  ? 'text-[var(--color-accent)]'
                  : 'text-white/60 hover:text-white/90'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
