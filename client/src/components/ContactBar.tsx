import { Code, Globe, Mail } from 'lucide-react'
import { usePortfolioStore } from '../stores/portfolioStore'

const ICON_MAP: Record<string, typeof Code> = {
  GitHub: Code,
  LinkedIn: Globe,
}

export function ContactBar() {
  const { socials } = usePortfolioStore()

  return (
    <div
      role="region"
      aria-label="Contact"
      className="flex items-center gap-4 border-t border-white/10 px-3 py-2"
    >
      <span className="shrink-0 font-mono text-[11px] text-white/40">
        ❯ ./contact
      </span>

      <div className="flex items-center gap-3">
        {socials.map(({ label, href }) => {
          const Icon = ICON_MAP[label] ?? Mail
          return (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-[var(--color-accent)]"
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{label}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
