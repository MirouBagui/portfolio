export function About() {
  return (
    <section
      id="about"
      className="flex min-h-screen flex-col items-center justify-center px-4 py-24"
    >
      <div className="max-w-2xl text-center">
        <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
          <span className="text-[var(--color-accent)]">#</span> About Me
        </h2>
        <p className="text-lg leading-relaxed text-white/60">
          Full-stack developer passionate about building clean, performant
          applications. I specialize in modern web technologies and love turning
          complex problems into simple, elegant solutions.
        </p>
      </div>
    </section>
  )
}
