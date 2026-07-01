import { useTypingEffect } from '../hooks/useTypingEffect';
import { usePortfolioStore } from '../stores/portfolioStore';

function FloatingShapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* hexagon */}
      <div className="absolute -top-10 right-16" style={{ animation: 'floatA 7s ease-in-out infinite' }}>
        <div
          className="h-[72px] w-[72px]"
          style={{
            background: 'linear-gradient(135deg,rgba(99,102,241,.55),rgba(6,182,212,.35))',
            clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
          }}
        />
      </div>
      {/* spinning ring */}
      <div className="absolute bottom-2 left-2" style={{ animation: 'floatB 9s ease-in-out infinite' }}>
        <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full border-[2.5px] border-[rgba(6,182,212,.4)]">
          <div
            className="h-12 w-12 rounded-full border-[1.5px] border-dashed border-[rgba(6,182,212,.25)]"
            style={{ animation: 'spinSlow 9s linear infinite' }}
          />
        </div>
      </div>
      {/* capsule */}
      <div className="absolute bottom-14 right-2" style={{ animation: 'floatC 8s ease-in-out infinite' }}>
        <div className="h-[18px] w-[58px] rounded-full border border-[rgba(16,185,129,.4)] bg-[rgba(16,185,129,.35)]" />
        <div className="-mt-px h-[34px] w-[58px] border border-t-0 border-[rgba(16,185,129,.25)] bg-[rgba(16,185,129,.08)]" />
        <div className="-mt-px h-[18px] w-[58px] rounded-full border border-[rgba(16,185,129,.3)] bg-[rgba(16,185,129,.2)]" />
      </div>
    </div>
  );
}

function TerminalCard({ firstName, role }: { firstName: string; role: string; }) {
  return (
    <div
      className="relative w-full max-w-[530px] overflow-hidden rounded-[14px] border border-[rgba(6,182,212,.18)] bg-[rgba(10,16,28,.92)] backdrop-blur-md"
      style={{ boxShadow: '0 32px 80px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.04)' }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 z-[1] h-px"
        style={{
          background: 'linear-gradient(90deg,transparent,rgba(6,182,212,.15),transparent)',
          animation: 'scanline 5s linear infinite',
        }}
      />
      <div className="flex items-center gap-2 border-b border-white/[6%] bg-white/[3%] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c941]" />
        </div>
        <span className="flex-1 text-center font-mono text-xs text-[#334155]">portfolio@dev — zsh</span>
      </div>
      <div className="px-7 py-6 font-mono text-[13px] leading-[1.85]">
        <p className="text-[#334155]">SYSTEM INITIALIZING...</p>
        <p className="text-[#334155]">OS: PortfolioOS v2.0.0</p>
        <p className="mb-5 text-[#334155]">KERNEL: React + TypeScript · build 2026</p>
        <p>
          <span className="text-[#22d3ee]">visitor</span>
          <span className="text-[#334155]">@</span>
          <span className="text-[#818cf8]">portfolio</span>
          <span className="text-[#334155]"> : ~ $ </span>
          <span className="text-[#e2e8f0]">about --whoami</span>
        </p>
        <div className="mt-3.5 border-l-2 border-[rgba(6,182,212,.35)] pl-3.5">
          <p className="font-sans text-xl font-bold tracking-tight text-[#f8fafc]">Hi, I'm {firstName}</p>
          <p className="mt-1.5 text-[13px] text-[#7dd3fc]">
            &gt; Role: <span className="text-[#f8fafc]">{role}</span>
          </p>
          <p className="mt-3 font-sans text-xs leading-relaxed text-[#475569]">
            Real-time systems · motorsport strategy · video platforms
          </p>
        </div>
        <p className="mt-[18px]">
          <span className="text-[#22d3ee]">visitor</span>
          <span className="text-[#334155]">@</span>
          <span className="text-[#818cf8]">portfolio</span>
          <span className="text-[#334155]"> : ~ $ </span>
          <span className="cursor-blink text-[#334155]">_</span>
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  const { name, role, specialisation, headlineLines, roles, tagline } = usePortfolioStore();
  const firstName = name.split(' ')[0];
  const typed = useTypingEffect(roles);

  return (
    <section id="home" className="relative z-[1] flex min-h-screen items-center">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center gap-12 px-6 pb-20 pt-28 sm:px-12 lg:flex-row lg:gap-20 lg:px-[72px]">
        {/* Left column */}
        <div className="w-full max-w-[540px] lg:w-[480px] lg:flex-none">
          <div className="mb-9 inline-flex items-center gap-2 rounded-full border border-[rgba(16,185,129,.25)] bg-[rgba(16,185,129,.08)] px-4 py-[7px]">
            <span
              className="block h-2 w-2 rounded-full bg-[#10b981]"
              style={{ animation: 'glowPulse 2s ease infinite' }}
            />
            <span className="font-mono text-[11px] tracking-[1px] text-[#10b981]">AVAILABLE FOR WORK</span>
          </div>

          <div className="mb-[18px]">
            <p className="mb-3.5 font-mono text-[11px] tracking-[2.5px] text-[#334155]">{specialisation}</p>
            <h1 className="text-[clamp(38px,3.2vw,52px)] font-bold leading-[1.05] tracking-[-2.5px]">
              {headlineLines.map((line, i) => (
                <span key={i}>
                  <span className={i === 1 ? 'text-[var(--color-accent)]' : undefined}>{line}</span>
                  {i < headlineLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
          </div>

          <div className="mb-7 flex h-9 items-center font-mono text-base">
            <span className="text-[#3b82f6]">→</span>
            <span className="ml-2 text-[#cbd5e1]">{typed}</span>
            <span className="cursor-blink ml-0.5 text-lg text-[var(--color-accent)]">█</span>
          </div>

          <p className="mb-11 max-w-[420px] text-base leading-[1.75] text-[var(--color-text-muted)]">
            {tagline}
          </p>

          <div className="flex flex-wrap gap-3.5">
            <a
              href="#projects"
              className="whitespace-nowrap rounded-lg bg-[var(--color-accent)] px-7 py-[13px] text-sm font-semibold text-[#050a14] transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(6,182,212,.3)]"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="whitespace-nowrap rounded-lg border-[1.5px] border-[rgba(6,182,212,.3)] px-7 py-3 text-sm font-medium text-[var(--color-accent)] transition-all hover:-translate-y-0.5 hover:border-[rgba(6,182,212,.7)] hover:bg-[rgba(6,182,212,.06)]"
            >
              Get In Touch
            </a>
          </div>
        </div>

        {/* Right column */}
        <div className="relative flex min-h-[420px] w-full max-w-[540px] flex-1 items-center justify-center">
          <FloatingShapes />
          <TerminalCard firstName={firstName} role={role} />
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5 opacity-35"
      >
        <span className="font-mono text-[10px] tracking-[2px] text-[#475569]">SCROLL</span>
        <div className="h-10 w-px bg-gradient-to-b from-[rgba(6,182,212,.7)] to-transparent" />
      </div>
    </section>
  );
}
