import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

function useHashScroll() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    let settle: ResizeObserver | undefined;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const stopSettling = () => {
      settle?.disconnect();
      clearTimeout(settleTimer);
      window.removeEventListener('wheel', stopSettling);
      window.removeEventListener('touchstart', stopSettling);
      window.removeEventListener('keydown', stopSettling);
    };

    function scroll() {
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior: 'smooth' });
      // Content above the target can still be loading (lazy diagrams on /architecture), which
      // pushes it down after the scroll starts. Re-align while the page grows, briefly, and
      // stop as soon as the visitor scrolls themselves.
      let first = true; // observe() reports the current size once; only react to growth after it
      settle = new ResizeObserver(() => {
        if (first) first = false;
        else el.scrollIntoView();
      });
      settle.observe(document.body);
      settleTimer = setTimeout(stopSettling, 1500);
      window.addEventListener('wheel', stopSettling, { passive: true });
      window.addEventListener('touchstart', stopSettling, { passive: true });
      window.addEventListener('keydown', stopSettling);
      return true;
    }

    if (scroll()) return stopSettling;

    let attempts = 0;
    const interval = setInterval(() => {
      if (scroll() || ++attempts > 30) clearInterval(interval);
    }, 100);

    return () => {
      clearInterval(interval);
      stopSettling();
    };
  }, [hash]);
}

export function RootLayout() {
  useHashScroll();

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
