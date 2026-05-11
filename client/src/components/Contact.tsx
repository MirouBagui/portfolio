import { Mail } from 'lucide-react'
import { usePortfolioStore } from '../stores/portfolioStore'

export function Contact() {
  const email = usePortfolioStore((s) =>
    s.socials.find((s) => s.label === 'Email'),
  )

  if (!email) return null

  return (
    <section
      id="contact"
      className="flex min-h-screen flex-col items-center justify-center px-4 py-24 scroll-mt-24"
    >
      <div className="max-w-lg text-center">
        <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
          <span className="text-[var(--color-accent)]">#</span> Get In Touch
        </h2>
        <p className="mb-8 text-white/60">
          Working on something interesting? Let's talk.
        </p>

        <div className="flex justify-center">
          <a
            href={email.href}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 font-medium text-white transition-all hover:bg-[var(--color-accent-hover)]"
          >
            <Mail size={18} />
            {email.href.replace('mailto:', '')}
          </a>
        </div>
      </div>
    </section>
  )
}
