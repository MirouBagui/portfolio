import { usePortfolioStore } from '../stores/portfolioStore'

export function Footer() {
  const { name } = usePortfolioStore()

  return (
    <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
      &copy; {new Date().getFullYear()} {name}. Built with NestJS + React.
    </footer>
  )
}
