import { type LoaderFunctionArgs } from 'react-router-dom'

export interface Project {
  id: string
  title: string
  description: string
}

export async function projectLoader({ params }: LoaderFunctionArgs) {
  const { id } = params
  if (!id) throw new Response('Not Found', { status: 404 })

  const projects: Project[] = [
    { id: '1', title: 'Project Alpha', description: 'A full-stack web application built with React and Node.js' },
    { id: '2', title: 'Project Beta', description: 'An open-source CLI tool for automation' },
    { id: '3', title: 'Project Gamma', description: 'A real-time dashboard with WebSocket support' },
  ]

  const project = projects.find((p) => p.id === id)
  if (!project) throw new Response('Not Found', { status: 404 })
  return project
}
