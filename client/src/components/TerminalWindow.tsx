import type { ReactNode } from 'react'

const DOT_COLORS = ['bg-red-500', 'bg-yellow-500', 'bg-green-500']

export function TerminalWindow({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="group relative w-full max-w-2xl">
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-[var(--color-accent)]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2 rounded-t-xl border-b border-white/10 bg-white/5 px-4 py-3">
          <div className="flex gap-1.5">
            {DOT_COLORS.map((c) => (
              <span key={c} className={`h-3 w-3 rounded-full ${c}`} />
            ))}
          </div>
          <span className="ml-3 font-mono text-xs text-white/40">{title}</span>
        </div>
        <div className="relative overflow-hidden rounded-b-xl p-6 sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_3px] opacity-[0.03]"
            aria-hidden
          />
          {children}
        </div>
      </div>
    </div>
  )
}
