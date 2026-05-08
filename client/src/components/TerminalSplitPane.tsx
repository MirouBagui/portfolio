import { useState, useCallback, type KeyboardEvent } from 'react'
import { WhoAmIPane } from './WhoAmIPane'
import { ProjectsPane } from './ProjectsPane'
import { ContactBar } from './ContactBar'
import { StatusLine } from './StatusLine'

type FocusZone = 'whoami' | 'projects' | 'contact'

export function TerminalSplitPane() {
  const [focus, setFocus] = useState<FocusZone>('whoami')

  const cycleFocus = useCallback(() => {
    setFocus((prev) => {
      if (prev === 'whoami') return 'projects'
      if (prev === 'projects') return 'contact'
      return 'whoami'
    })
  }, [])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        cycleFocus()
      }
    },
    [cycleFocus],
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
          className={`min-w-0 flex-1 border-b border-white/10 p-4 transition-all duration-150 md:basis-[30%] md:border-b-0 md:border-r md:overflow-y-auto ${
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
          className={`flex min-h-0 flex-1 flex-col overflow-hidden border-b border-white/10 p-4 transition-all duration-150 md:basis-[70%] md:border-b-0 ${
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
