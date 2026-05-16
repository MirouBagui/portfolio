export function TerminalLoading({ label = 'loading' }: { label?: string }) {
  return (
    <div className="flex items-center gap-1 font-mono text-xs text-white/30">
      <span className="text-green-400">$</span>
      <span>{label}</span>
      <span className="terminal-loading-dot">.</span>
      <span className="terminal-loading-dot">.</span>
      <span className="terminal-loading-dot">.</span>
    </div>
  )
}
