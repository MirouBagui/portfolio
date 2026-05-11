import { usePortfolioStore } from '../stores/portfolioStore'

export function About() {
  const { aboutParagraphs } = usePortfolioStore()

  return (
    <section
      id="about"
      className="flex flex-col items-center justify-center px-4 py-24 scroll-mt-24"
    >
      <div className="max-w-2xl text-center">
        <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
          <span className="text-[var(--color-accent)]">#</span> About Me
        </h2>
        <div className="space-y-4 text-left text-white/60">
          {aboutParagraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
