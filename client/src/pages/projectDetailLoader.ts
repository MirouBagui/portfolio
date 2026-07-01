import { type LoaderFunctionArgs } from 'react-router-dom'
import { usePortfolioStore } from '../stores/portfolioStore'
import type { Project } from '../stores/portfolioStore'

export type { Project }

export async function projectLoader({ params }: LoaderFunctionArgs) {
  const { id } = params
  if (!id) throw new Response('Not Found', { status: 404 })

  const projects = usePortfolioStore.getState().projects
  const project = projects.find((p) => p.id === id)
  if (!project) throw new Response('Not Found', { status: 404 })
  return project
}
