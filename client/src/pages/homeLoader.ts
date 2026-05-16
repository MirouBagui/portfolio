import { githubLoader } from './githubLoader'
import { usePortfolioStore } from '../stores/portfolioStore'

export async function homeLoader() {
  const profile = await githubLoader()

  if (profile?.pinnedItems?.edges) {
    const repos = profile.pinnedItems.edges.map((e) => e.node)
    usePortfolioStore.getState().setGitHubRepos(repos)
  }

  return null
}
