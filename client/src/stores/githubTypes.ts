export interface GitHubRepo {
  id: string
  name: string
  description: string | null
  url: string
  homepageUrl: string | null
  stargazerCount: number
  forkCount: number
  primaryLanguage: { name: string; color: string } | null
  languages?: { nodes: Array<{ name: string; color: string }> }
}

export interface GitHubProfile {
  name: string
  bio: string | null
  avatarUrl: string
  location: string | null
  company: string | null
  websiteUrl: string | null
  twitterUsername: string | null
  pinnedItems: {
    totalCount: number
    edges: Array<{ node: GitHubRepo }>
  }
  repositories: {
    nodes: GitHubRepo[]
  }
}
