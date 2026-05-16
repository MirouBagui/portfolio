import type { GitHubProfile } from '../stores/githubTypes'

export async function githubLoader(): Promise<GitHubProfile | null> {
  try {
    const res = await fetch('/api/github/profile')
    if (!res.ok) return null
    return await res.json() as GitHubProfile
  } catch {
    return null
  }
}
