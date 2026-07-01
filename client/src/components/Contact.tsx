import { usePortfolioStore } from '../stores/portfolioStore';

export function Contact() {
  const { socials } = usePortfolioStore();
  const email = socials.find((s) => s.label === 'Email');
  const links = socials.filter((s) => s.label !== 'Email');

  return (
    <section id="contact" className="relative z-[1] scroll-mt-16 px-6 py-[140px] sm:px-12 lg:px-[72px]">
      <div className="mx-auto max-w-[640px] text-center">
        <p className="mb-[18px] font-mono text-xs tracking-[2.5px] text-[var(--color-accent)]">// CONTACT</p>
        <h2 className="mb-4 text-[clamp(36px,4vw,58px)] font-bold leading-[1.1] tracking-[-2px]">
          Let's build fast—but build it
          <br />
          <span className="text-[var(--color-accent)]">unshakeable.</span>
        </h2>
        <p className="mx-auto mb-12 max-w-[460px] text-base leading-[1.75] text-[#475569]">
          Open to senior full-stack and real-time systems roles. Let's talk architecture, scale, and speed.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          {email && (
            <a
              href={email.href}
              className="rounded-lg bg-[var(--color-accent)] px-8 py-3.5 text-[15px] font-semibold text-[#050a14] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(6,182,212,.35)]"
            >
              Send Email
            </a>
          )}
          {links.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border-[1.5px] border-[rgba(6,182,212,.25)] px-8 py-[13px] text-[15px] font-medium text-[#7dd3fc] transition-all hover:-translate-y-0.5 hover:border-[rgba(6,182,212,.6)] hover:bg-[rgba(6,182,212,.05)]"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
