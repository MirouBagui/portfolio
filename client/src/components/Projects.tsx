import { Link } from 'react-router-dom'

const PROJECTS = [
  { id: '1', title: 'Project Alpha', description: 'A full-stack web application' },
  { id: '2', title: 'Project Beta', description: 'An open-source CLI tool' },
  { id: '3', title: 'Project Gamma', description: 'A real-time dashboard' },
]

export function Projects() {
  return (
    <section
      id="projects"
      className="flex min-h-screen flex-col items-center justify-center px-4 py-24"
    >
      <h2 className="mb-12 text-3xl font-bold sm:text-4xl">
        <span className="text-[var(--color-accent)]">#</span> Projects
      </h2>

      <div className="grid w-full max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map(({ id, title, description }) => (
          <Link
            key={id}
            to={`/projects/${id}`}
            className="group rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:border-[var(--color-accent)]/50 hover:bg-white/10"
          >
            <h3 className="mb-2 font-semibold text-white/90 group-hover:text-[var(--color-accent)]">
              {title}
            </h3>
            <p className="text-sm text-white/50">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
