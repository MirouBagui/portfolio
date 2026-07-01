import { useLoaderData, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { Project } from './projectDetailLoader'
import { usePageMeta } from '../hooks/usePageMeta'

export function ProjectDetail() {
  const project = useLoaderData() as Project
  usePageMeta(`${project.title} — Amir SAOUDI`, project.description)

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

        {project.role && (
          <p className="mb-6 text-sm font-medium text-[var(--color-accent)]">
            Role: {project.role}
          </p>
        )}

        <p className="mb-8 text-lg leading-relaxed text-white/60">
          {project.description}
        </p>

        {project.tech && project.tech.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-medium text-white/40">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-white/[8%] bg-white/[3%] px-3 py-1 font-mono text-xs text-white/60"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
