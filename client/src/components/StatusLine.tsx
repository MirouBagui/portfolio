export function StatusLine() {
  return (
    <div
      className="flex items-center gap-3 border-t border-white/[6%] px-3 py-1.5"
      aria-live="polite"
      role="status"
    >
      <span className="text-[11px] text-green-500/60">● NORMAL</span>
      <span className="text-[11px] text-white/20">
        tab to focus pane &middot; j/k to scroll
      </span>
    </div>
  )
}
