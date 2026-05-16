import { Link, useLocation } from 'react-router-dom';
import { match } from 'ts-pattern';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { usePortfolioStore } from '../stores/portfolioStore';
import type { MouseEvent } from 'react';

const LINKS = [
  { to: '/#home', label: 'Home' },
  { to: '/#skills', label: 'Skills' },
  { to: '/#projects', label: 'Projects' },
  { to: '/#contact', label: 'Contact' },
  { to: '/blog', label: 'Blog' },
] as const;

function isHashLink(to: string): boolean {
  return to.startsWith('/#');
}

function scrollToHash(to: string) {
  const id = to.replace('/#', '');
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

export function Navbar() {
  const location = useLocation();
  const { name } = usePortfolioStore();
  const first = name.split(' ')[0];
  const { direction, y } = useScrollDirection();
  const hidden = direction === 'down' && y > 80;

  function handleClick(e: MouseEvent, to: string) {
    if (!isHashLink(to)) return;
    if (location.pathname === '/') {
      e.preventDefault();
      window.history.replaceState(null, '', to);
      scrollToHash(to);
    }
  }

  return (
    <nav
      className={`fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-[var(--color-bg-primary)]/80 px-6 py-4 backdrop-blur-md transition-transform duration-300 sm:px-12 ${hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <Link to="/" className="text-lg font-bold tracking-tight" aria-label="Home">
        <span className="text-[var(--color-accent)]">&lt;</span>
        {first.toLowerCase()}
        <span className="text-[var(--color-accent)]"> /&gt;</span>
      </Link>

      <div className="flex items-center gap-6">
        {LINKS.map(({ to, label }) => {
          const isActive = match({ path: location.pathname + location.hash })
            .with({ path: to }, () => true)
            .otherwise(() => false);

          return (
            <Link
              key={label}
              to={to}
              onClick={(e) => handleClick(e, to)}
              aria-current={isActive ? 'page' : undefined}
              className={`text-sm transition-colors ${isActive
                ? 'text-[var(--color-accent)]'
                : 'text-white/60 hover:text-white/90'
                }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
