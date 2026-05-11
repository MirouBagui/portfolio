import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { TerminalWindow } from './TerminalWindow';
import { TerminalSplitPane } from './TerminalSplitPane';
import { ArrowDown } from 'lucide-react';

const HeroScene = lazy(() =>
  import('./HeroScene').then((m) => ({ default: m.HeroScene })),
);

function HeroBackground() {
  return <Suspense fallback={null}><HeroScene /></Suspense>;
}

function DeferredHeroScene({ children }: { children: ReactNode; }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasIdle = 'requestIdleCallback' in window;
    const idleId = hasIdle
      ? window.requestIdleCallback(() => setReady(true), { timeout: 5000 })
      : window.setTimeout(() => setReady(true), 5000);
    return () => {
      if (typeof idleId === 'number') {
        if (hasIdle) window.cancelIdleCallback(idleId);
        else window.clearTimeout(idleId);
      }
    };
  }, []);

  return ready ? <>{children}</> : null;
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <DeferredHeroScene><HeroBackground /></DeferredHeroScene>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-accent)_0%,_transparent_60%)] opacity-15" />

      <div className="relative z-10 flex w-full flex-col items-center">
        <TerminalWindow title="portfolio@terminal — bash (split-pane)" wide>
          <TerminalSplitPane />
        </TerminalWindow>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 flex animate-bounce flex-col items-center gap-1 text-white/20 transition-colors hover:text-white/50"
        aria-label="Scroll down"
      >
        <span className="font-mono text-[11px]">$ cd about</span>
        <ArrowDown size={16} />
      </a>
    </section>
  );
}
