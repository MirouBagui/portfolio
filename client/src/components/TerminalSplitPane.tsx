import { useState, useCallback, useRef, type KeyboardEvent } from 'react'
import { WhoAmIPane } from './WhoAmIPane'
import { ProjectsPane } from './ProjectsPane'
import { ContactBar } from './ContactBar'
import { StatusLine } from './StatusLine'

type FocusZone = 'whoami' | 'projects' | 'contact'

const ORDER: FocusZone[] = ['whoami', 'projects', 'contact']

export function TerminalSplitPane() {
  const [focus, setFocus] = useState<FocusZone>('whoami')
  const whoamiRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  const paneRef: Record<FocusZone, React.RefObject<HTMLDivElement | null>> = {
    whoami: whoamiRef,
    projects: projectsRef,
    contact: contactRef,
  }

  const cycleFocus = useCallback((forward: boolean = true) => {
    setFocus((prev) => {
      const idx = ORDER.indexOf(prev)
      const next = forward
        ? (idx + 1) % ORDER.length
        : (idx - 1 + ORDER.length) % ORDER.length
      return ORDER[next]
    })
  }, [])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        cycleFocus(!e.shiftKey)
      }
      if (e.key === 'j' || e.key === 'k') {
        const el = paneRef[focus].current
        if (el) {
          const dir = e.key === 'j' ? 1 : -1
          el.scrollBy({ top: 80 * dir, behavior: 'smooth' })
        }
      }
    },
    [cycleFocus, focus],
  )

  return (
    <div
      className="flex flex-col terminal-fade-in terminal-scanline"
      onKeyDown={onKeyDown}
      role="region"
      aria-label="Terminal dashboard"
    >
      <div className="flex flex-col gap-0 md:flex-row">
        {/* Left pane: whoami */}
        <div
          ref={whoamiRef}
          className={`min-w-0 flex-1 border-b border-white/10 p-4 transition-all duration-150 md:basis-[30%] md:border-b-0 md:border-r md:overflow-y-auto scrollbar-none ${
            focus === 'whoami'
              ? 'ring-1 ring-inset ring-indigo-400/30'
              : ''
          }`}
          onClick={() => setFocus('whoami')}
          role="tabpanel"
          aria-label="Who am I"
        >
          <WhoAmIPane />
        </div>

        {/* Right pane: projects */}
        <div
          ref={projectsRef}
          className={`flex min-h-0 flex-1 flex-col overflow-y-auto border-b border-white/10 p-4 transition-all duration-150 md:basis-[70%] md:border-b-0 scrollbar-none ${
            focus === 'projects'
              ? 'ring-1 ring-inset ring-indigo-400/30'
              : ''
          }`}
          onClick={() => setFocus('projects')}
          role="tabpanel"
          aria-label="Projects"
        >
          <ProjectsPane focused={focus === 'projects'} />
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
  )
}
