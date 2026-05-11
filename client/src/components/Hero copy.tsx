import { useTypingEffect } from '../hooks/useTypingEffect'
import { HeroScene } from './HeroScene'
import { TerminalWindow } from './TerminalWindow'
import { Code, Globe, Mail, ArrowDown } from 'lucide-react'

const ROLES = [
  'Full Stack Developer',
  'UI/UX Designer',
  'Open Source Enthusiast',
  'Problem Solver',
]

const SOCIAL_LINKS = [
  { href: 'https://github.com', icon: Code, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Globe, label: 'LinkedIn' },
  { href: 'mailto:hello@example.com', icon: Mail, label: 'Email' },
]

function BootSequence() {
  return (
    <div className="mb-6 space-y-1 font-mono text-xs text-white/30">
      <p className="animate-pulse">SYSTEM INITIALIZING...</p>
      <p>OS: PortfolioOS v1.0.0</p>
      <p>KERNEL: React + NestJS 11</p>
      <p className="text-[var(--color-accent)]/50">SHELL: zsh 5.9</p>
    </div>
  )
}

export function Hero() {
  const typedText = useTypingEffect(ROLES)

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <HeroScene />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-accent)_0%,_transparent_60%)] opacity-15" />

      <div className="relative z-10 flex w-full flex-col items-center gap-8">
        <TerminalWindow title="portfolio@dev — zsh">
          <BootSequence />

          <div className="space-y-3 font-mono text-sm">
            <div className="flex flex-wrap gap-1">
              <span className="text-green-400">visitor</span>
              <span className="text-white/40">@</span>
              <span className="text-[var(--color-accent)]">portfolio</span>
              <span className="text-white/40">:</span>
              <span className="text-cyan-400">~</span>
              <span className="text-white/40">$</span>
              <span className="ml-2 text-white/60">about --whoami</span>
            </div>

            <div className="border-l-2 border-[var(--color-accent)]/30 pl-4">
              <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">
                <span className="text-[var(--color-accent)]">Hi, I'm </span>
                <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] bg-clip-text text-transparent">
                  Your Name
                </span>
              </h1>
              <div className="h-7">
                <p className="text-base text-white/70">
                  <span className="font-semibold text-[var(--color-accent)]">
                    &gt; Role:{' '}
                  </span>
                  <span>{typedText}</span>
                  <span className="ml-0.5 animate-pulse text-[var(--color-accent)]">
                    │
                  </span>
                </p>
              </div>
              <p className="mt-2 text-xs text-white/40">
                I build digital experiences that blend creativity with clean
                code.
              </p>
            </div>

            <div className="flex flex-wrap gap-1 pt-2">
              <span className="text-green-400">visitor</span>
              <span className="text-white/40">@</span>
              <span className="text-[var(--color-accent)]">portfolio</span>
              <span className="text-white/40">:</span>
              <span className="text-cyan-400">~</span>
              <span className="text-white/40">$</span>
              <span className="ml-2 animate-pulse text-white/60">_</span>
            </div>
          </div>
        </TerminalWindow>

        <div className="relative z-10 flex items-center gap-6">
          {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-white/30 transition-colors hover:text-[var(--color-accent)]"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 flex animate-bounce flex-col items-center gap-1 text-white/20 transition-colors hover:text-white/50"
        aria-label="Scroll down"
      >
        <span className="font-mono text-[10px]">$ cd about</span>
        <ArrowDown size={16} />
      </a>
    </section>
  )
}
