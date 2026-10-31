import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { usePortfolioStore } from '../stores/portfolioStore';

// One list for the inline row and the phone menu (ADR-0006).
// Services takes the last slot when feat/security-audit-service merges.
const LINKS = [
  { to: '/#home', label: 'Home' },
  { to: '/#skills', label: 'Skills' },
  { to: '/#projects', label: 'Projects' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/blog', label: 'Blog' },
] as const;

const MENU_ID = 'nav-menu';
const SM_UP = '(min-width: 640px)';

function isHashLink(to: string): boolean {
  return to.startsWith('/#');
}

/** Hash links match pathname + hash exactly; page links match by pathname, so `/architecture#…` still counts. */
function isActiveLink(to: string, pathname: string, hash: string): boolean {
  if (isHashLink(to)) return pathname + hash === to;
  return pathname === to || pathname.startsWith(`${to}/`);
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
  const navigate = useNavigate();
  const { name } = usePortfolioStore();
  const first = name.split(' ')[0];
  const { direction, y } = useScrollDirection();
  const hidden = direction === 'down' && y > 80;
  const [open, setOpen] = useState(false);
  const [lastKey, setLastKey] = useState(location.key);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on any navigation, including back/forward.
  if (lastKey !== location.key) {
    setLastKey(location.key);
    setOpen(false);
  }
  // The list hangs below the nav, so translating the nav alone would leave it on screen:
  // it closes as the nav hides on scroll-down (ADR-0006).
  if (hidden && open) setOpen(false);

  // Close when the viewport grows past sm, where the links are inline again.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia(SM_UP);
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [open]);

  function handleKeyDown(e: ReactKeyboardEvent) {
    if (open && e.key === 'Escape') {
      setOpen(false);
      toggleRef.current?.focus();
    }
  }

  function handleClick(e: MouseEvent, to: string) {
    setOpen(false);
    if (!isHashLink(to)) return;
    if (location.pathname === '/') {
      e.preventDefault();
      // Go through the router so location.hash (and aria-current) update.
      navigate(to, { replace: true });
      scrollToHash(to);
    }
  }

  const links = LINKS.map(({ to, label }) => ({
    to,
    label,
    active: isActiveLink(to, location.pathname, location.hash),
  }));

  return (
    <nav
      className={`fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-[var(--color-bg-primary)]/80 px-6 py-4 backdrop-blur-md transition-transform duration-300 sm:px-12 ${hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      role="navigation"
      aria-label="Main navigation"
      onKeyDown={handleKeyDown}
    >
      <Link to="/" className="text-lg font-bold tracking-tight" aria-label="Home">
        <span className="text-[var(--color-accent)]">&lt;</span>
        {first.toLowerCase()}
        <span className="text-[var(--color-accent)]"> /&gt;</span>
      </Link>

      <div className="hidden items-center gap-6 sm:flex">
        {links.map(({ to, label, active }) => (
          <Link
            key={label}
            to={to}
            onClick={(e) => handleClick(e, to)}
            aria-current={active ? 'page' : undefined}
            className={`text-sm transition-colors ${active
              ? 'text-[var(--color-accent)]'
              : 'text-white/60 hover:text-white/90'
              }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Below sm the links sit behind a toggle: a fifth link would overflow the fixed row unseen (ADR-0006). */}
      <button
        ref={toggleRef}
        type="button"
        className="-my-2 flex min-h-11 items-center px-2 font-mono text-sm text-text-muted transition-colors hover:text-text-primary sm:hidden"
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-accent">$</span>&nbsp;menu
      </button>

      <ul
        id={MENU_ID}
        className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-full flex-col border-b border-border bg-bg-primary px-6 py-2 sm:hidden`}
      >
        {links.map(({ to, label, active }) => (
          <li key={label}>
            <Link
              to={to}
              onClick={(e) => handleClick(e, to)}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-11 items-center font-mono text-sm transition-colors ${active ? 'text-accent' : 'text-text-muted hover:text-text-primary'
                }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
