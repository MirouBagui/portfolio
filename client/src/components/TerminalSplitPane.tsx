import { useState, useCallback, useRef, type KeyboardEvent } from 'react';
import { ProjectsPane } from './ProjectsPane';
import { ContactBar } from './ContactBar';
import { StatusLine } from './StatusLine';

type FocusZone = 'whoami' | 'projects' | 'contact';

const ORDER: FocusZone[] = ['whoami', 'projects', 'contact'];

export function TerminalSplitPane() {
  const [focus, setFocus] = useState<FocusZone>('projects');
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const whoamiRef = useRef<HTMLDivElement>(null);

  const cycleFocus = useCallback((forward: boolean = true) => {
    setFocus((prev) => {
      const idx = ORDER.indexOf(prev);
      const next = forward
        ? (idx + 1) % ORDER.length
        : (idx - 1 + ORDER.length) % ORDER.length;
      return ORDER[next];
    });
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        cycleFocus(!e.shiftKey);
      }
      if (e.key === 'j' || e.key === 'k') {
        const el = focus === 'whoami' ? whoamiRef.current
          : focus === 'projects' ? projectsRef.current
            : contactRef.current;
        if (el) {
          const dir = e.key === 'j' ? 1 : -1;
          el.scrollBy({ top: 80 * dir, behavior: 'smooth' });
        }
      }
    },
    [cycleFocus, focus],
  );

  return (
    <div
      className="flex flex-col terminal-fade-in terminal-scanline"
      onKeyDown={onKeyDown}
      role="region"
      aria-label="Terminal dashboard"
    >
      <div className="flex flex-col gap-0 md:flex-row">
        {/* Left pane: whoami (30%) */}
        <div
          ref={projectsRef}
          className={`flex min-h-0 flex-1 flex-col overflow-y-auto border-b border-white/10 p-4 transition-all duration-150 md:border-b-0 scrollbar-none ${focus === 'projects'
            ? 'ring-1 ring-inset ring-indigo-400/30'
            : ''
            }`}
          onClick={() => setFocus('projects')}
          role="tabpanel"
          aria-label="Projects"
        >
          <ProjectsPane />
        </div>
      </div>

      {/* Contact bar */}
      <div
        ref={contactRef}
        className={`shrink-0 transition-all duration-150 ${focus === 'contact' ? 'ring-1 ring-inset ring-indigo-400/30' : ''}`}
        onClick={() => setFocus('contact')}
        role="tabpanel"
        aria-label="Contact"
      >
        <ContactBar />
      </div>

      <StatusLine />
    </div>
  );
}
