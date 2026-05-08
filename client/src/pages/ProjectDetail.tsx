import { useLoaderData, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { Project } from './projectDetailLoader'

export function ProjectDetail() {
  const project = useLoaderData() as Project

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
      <div className="w-full max-w-2xl">
        <Link
          to="/#projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-[var(--color-accent)]"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <h1 className="mb-4 text-4xl font-bold">{project.title}</h1>
        <p className="text-lg text-white/60">{project.description}</p>
      </div>
    </section>
  )
}
