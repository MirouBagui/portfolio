import { usePortfolioStore } from '../stores/portfolioStore';

export function Footer() {
  const { name } = usePortfolioStore();
  const first = name.split(' ')[0].toLowerCase();

  return (
    <footer className="relative z-[1] flex items-center justify-between border-t border-white/[4%] px-6 py-7 sm:px-12 lg:px-[72px]">
      <span className="font-mono text-[13px] text-[#1e293b]">&lt;{first} /&gt;</span>
      <span className="font-mono text-xs text-[#1e293b]">
        Built with React + TypeScript · {new Date().getFullYear()}
      </span>
    </footer>
  );
}
