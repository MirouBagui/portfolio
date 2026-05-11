const PromptLine = ({ command }: { command: string; }) => (
    <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <span className="text-green-400">amir</span>
        <span className="text-white/30">@</span>
        <span className="text-[var(--color-accent)]">portfolio</span>
        <span className="text-white/30">:</span>
        <span className="text-cyan-400">~</span>
        <span className="text-white/30">$</span>
        <span className="ml-1 text-xs text-white/50">
            {command}
        </span>
    </div>
);

export default PromptLine;