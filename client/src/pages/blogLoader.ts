export interface BlogPost {
  id: string
  title: string
  excerpt: string
}

export async function blogLoader(): Promise<BlogPost[]> {
  return [
    { id: '1', title: 'Getting Started with NestJS', excerpt: 'A beginner-friendly guide to building APIs with NestJS.' },
    { id: '2', title: 'React 19 Features', excerpt: 'Exploring the latest features in React 19.' },
  ]
}
