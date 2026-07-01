import { usePortfolioStore } from '../stores/portfolioStore';
import { useReveal, revealClass } from '../hooks/useReveal';
import type { Project } from '../stores/portfolioStore';
import type { ReactNode } from 'react';

const TAG = 'rounded border border-white/5 bg-white/[4%] px-2 py-[3px] font-mono text-[10px] text-[#475569]';

function TechTags({ tech }: { tech?: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tech?.map((t) => (
        <span key={t} className={TAG}>{t}</span>
      ))}
    </div>
  );
}

/* ---------- Featured: Stellantis F1 ---------- */

function TelemetryBar({
  label,
  value,
  valueColor,
  pct,
  from,
  to,
  shown,
}: {
  label: string;
  value: string;
  valueColor: string;
  pct: number;
  from: string;
  to: string;
  shown: boolean;
}) {
  return (
    <div className="mb-3">
      <div className="mb-[5px] flex justify-between">
        <span className="text-[10px] tracking-[.8px] text-[#475569]">{label}</span>
        <span className="text-[10px]" style={{ color: valueColor, animation: 'dataBlip 2s ease infinite' }}>
          {value}
        </span>
      </div>
      <div className="h-[3px] overflow-hidden rounded-sm bg-white/5">
        <div
          className="h-full rounded-sm transition-[width] duration-[1600ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
          style={{ width: shown ? `${pct}%` : '0%', background: `linear-gradient(90deg,${from},${to})` }}
        />
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[6%] bg-white/[3%] px-3 py-2.5">
      <p className="mb-1 text-[9px] tracking-[.8px] text-[#334155]">{label}</p>
      <p className="text-[17px] font-bold leading-none tracking-[-1px] text-[#f1f5f9]">{value}</p>
    </div>
  );
}

function FeaturedCard({ p }: { p: Project }) {
  const [ref, shown] = useReveal<HTMLDivElement>(0);

  return (
    <div
      ref={ref}
      className={`relative mb-5 overflow-hidden rounded-2xl border border-[rgba(59,130,246,.18)] bg-[rgba(10,16,28,.85)] hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(59,130,246,.1)] ${revealClass(shown)}`}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: 'linear-gradient(90deg,transparent 5%,#3b82f6 40%,#06b6d4 60%,transparent 95%)' }}
      />
      <div className="flex flex-col lg:flex-row">
        {/* left: info */}
        <div className="flex-1 px-11 py-10">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="font-mono text-[11px] tracking-[.5px] text-[#334155]">/featured · project-{p.id}</span>
            <span className="rounded-full border border-[rgba(59,130,246,.25)] bg-[rgba(59,130,246,.1)] px-2.5 py-[3px] font-mono text-[10px] text-[#7dd3fc]">
              FLAGSHIP
            </span>
          </div>
          <h3 className="mb-1.5 text-[28px] font-bold tracking-[-.8px]">{p.name ?? p.title}</h3>
          <p className="mb-5 text-sm font-medium text-[#7dd3fc]">
            {p.role}
            {p.period && ` · ${p.period}`}
          </p>
          <p className="mb-8 max-w-[420px] text-sm leading-[1.75] text-[var(--color-text-muted)]">{p.description}</p>

          <div className="mb-8 flex gap-6">
            {[
              { v: '50k+', l: 'DATA POINTS/S' },
              { v: '<50ms', l: 'LATENCY' },
              { v: '24/7', l: 'RACE UPTIME' },
            ].map((s, i) => (
              <div key={s.l} className="flex gap-6">
                {i > 0 && <div className="w-px bg-white/[6%]" />}
                <div>
                  <p className="font-mono text-2xl font-bold leading-none text-[#93c5fd]">{s.v}</p>
                  <p className="mt-[5px] font-mono text-[10px] tracking-[.8px] text-[#334155]">{s.l}</p>
                </div>
              </div>
            ))}
          </div>

          <TechTags tech={p.tech} />
        </div>

        {/* right: live telemetry */}
        <div className="flex flex-col border-t border-[rgba(59,130,246,.1)] bg-[rgba(3,7,18,.85)] p-7 font-mono lg:w-[360px] lg:flex-none lg:border-l lg:border-t-0">
          <div className="mb-[18px] flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <span className="block h-[7px] w-[7px] rounded-full bg-[#ef4444]" style={{ animation: 'liveDot 1.4s ease infinite' }} />
              <span className="text-[10px] tracking-[1.5px] text-[#64748b]">LIVE TELEMETRY</span>
            </div>
            <span className="text-[10px] text-[#334155]">LAP 47 / 58</span>
          </div>

          <TelemetryBar label="RPM" value="18,200" valueColor="#93c5fd" pct={95} from="#1d4ed8" to="#7dd3fc" shown={shown} />
          <TelemetryBar label="SPEED" value="312 km/h" valueColor="#93c5fd" pct={82} from="#1d4ed8" to="#7dd3fc" shown={shown} />
          <TelemetryBar label="THROTTLE" value="88%" valueColor="#6ee7b7" pct={88} from="#059669" to="#6ee7b7" shown={shown} />
          <TelemetryBar label="BRAKE" value="15%" valueColor="#fca5a5" pct={15} from="#dc2626" to="#fca5a5" shown={shown} />

          <div className="mb-3 mt-2 grid grid-cols-2 gap-2">
            <StatBox label="LAP TIME" value="1:23.4" />
            <StatBox label="SECTOR 3" value="28.1s" />
            <div className="rounded-lg border border-white/[6%] bg-white/[3%] px-3 py-2.5">
              <p className="mb-1 text-[9px] tracking-[.8px] text-[#334155]">GAP AHEAD</p>
              <p className="text-[17px] font-bold leading-none tracking-[-1px] text-[#f97316]">+0.312</p>
            </div>
            <StatBox label="STINT" value="12 laps" />
          </div>

          <div className="mt-auto flex gap-2">
            <div className="flex-1 rounded-md border border-[rgba(239,68,68,.2)] bg-[rgba(239,68,68,.08)] py-2 text-center">
              <p className="text-[9px] tracking-[.5px] text-[#475569]">TYRE</p>
              <p className="mt-0.5 text-[13px] font-bold text-[#ef4444]">SOFT</p>
            </div>
            <div className="flex-1 rounded-md border border-[rgba(16,185,129,.2)] bg-[rgba(16,185,129,.08)] py-2 text-center">
              <p className="text-[9px] tracking-[.5px] text-[#475569]">DRS</p>
              <p className="mt-0.5 text-[13px] font-bold text-[#10b981]">OPEN</p>
            </div>
            <div className="flex-1 rounded-md border border-white/[6%] bg-white/[3%] py-2 text-center">
              <p className="text-[9px] tracking-[.5px] text-[#475569]">TYRE °C</p>
              <p className="mt-0.5 text-[13px] font-bold text-[#f97316]">94°</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Grid card shell + bespoke visuals ---------- */

const GRID_BORDER: Record<string, string> = {
  violet: 'rgba(139,92,246,.15)',
  green: 'rgba(16,185,129,.15)',
  orange: 'rgba(249,115,22,.15)',
  cyan: 'rgba(6,182,212,.15)',
};
const ROLE_COLOR: Record<string, string> = {
  violet: '#c4b5fd',
  green: '#6ee7b7',
  orange: '#fdba74',
  cyan: '#7dd3fc',
};

function GridCard({ p, delay, visual }: { p: Project; delay: number; visual: ReactNode }) {
  const [ref, shown] = useReveal<HTMLDivElement>(delay);
  const accent = p.accent ?? 'cyan';

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-[14px] border bg-[rgba(10,16,28,.85)] hover:-translate-y-[5px] ${revealClass(shown)}`}
      style={{ borderColor: GRID_BORDER[accent] }}
    >
      <div className="relative h-[164px] overflow-hidden bg-[rgba(3,7,18,.9)]">{visual}</div>
      <div className="px-[26px] py-[22px]">
        <p className="mb-[7px] font-mono text-[11px] text-[#334155]">/project-{p.id}</p>
        <h3 className="mb-[3px] text-[17px] font-semibold tracking-[-.3px]">{p.name ?? p.title}</h3>
        <p className="mb-[11px] text-[13px]" style={{ color: ROLE_COLOR[accent] }}>{p.role}</p>
        <p className="mb-3.5 text-[13px] leading-[1.65] text-[var(--color-text-muted)]">{p.description}</p>
        <TechTags tech={p.tech} />
      </div>
    </div>
  );
}

function VideoTile({ initials, color, bg, border, status, statusColor, speaking }: {
  initials: string; color: string; bg: string; border: string; status: string; statusColor: string; speaking?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-[5px] rounded-[7px] border" style={{ background: bg, borderColor: border }}>
      <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full" style={{ background: color }}>
        <span className="text-[11px] font-bold" style={{ color: statusColor }}>{initials}</span>
      </div>
      <span className="font-mono text-[8px]" style={{ color: speaking ? statusColor : '#334155' }}>{status}</span>
    </div>
  );
}

function AIAVisual() {
  return (
    <div className="grid h-full grid-cols-2 gap-1.5 p-3">
      <div className="absolute right-2.5 top-2.5 z-[2] flex items-center gap-[5px] rounded-full border border-[rgba(239,68,68,.35)] bg-black/65 px-2.5 py-[3px]">
        <span className="block h-1.5 w-1.5 rounded-full bg-[#ef4444]" style={{ animation: 'liveDot 1.2s ease infinite' }} />
        <span className="font-mono text-[9px] tracking-[1px] text-[#ef4444]">REC</span>
      </div>
      <VideoTile initials="AJ" color="rgba(139,92,246,.4)" bg="linear-gradient(135deg,rgba(139,92,246,.28),rgba(109,40,217,.1))" border="rgba(139,92,246,.22)" status="● SPEAKING" statusColor="#c4b5fd" speaking />
      <VideoTile initials="MK" color="rgba(6,182,212,.28)" bg="linear-gradient(135deg,rgba(6,182,212,.18),rgba(14,116,144,.08))" border="rgba(6,182,212,.18)" status="CONNECTED" statusColor="#7dd3fc" />
      <VideoTile initials="SP" color="rgba(16,185,129,.28)" bg="linear-gradient(135deg,rgba(16,185,129,.18),rgba(5,150,105,.08))" border="rgba(16,185,129,.18)" status="CONNECTED" statusColor="#6ee7b7" />
      <div className="flex flex-col items-center justify-center gap-1 rounded-[7px] border border-dashed border-white/[7%] bg-white/[2%]">
        <span className="text-xl leading-none text-[#1e293b]">+</span>
        <span className="font-mono text-[8px] text-[#1e293b]">JOIN</span>
      </div>
    </div>
  );
}

function FlowNode({ label, value, sub, grow }: { label: string; value: string; sub: string; grow?: boolean }) {
  return (
    <div
      className="rounded-lg border px-2 py-3 text-center"
      style={{
        flex: grow ? 1.1 : 1,
        background: grow ? 'rgba(16,185,129,.12)' : 'rgba(16,185,129,.07)',
        borderColor: grow ? 'rgba(16,185,129,.35)' : 'rgba(16,185,129,.22)',
      }}
    >
      <p className="mb-[5px] font-mono text-[8px] tracking-[.5px] text-[#334155]">{label}</p>
      <p className="font-mono text-[11px] font-semibold leading-tight text-[#6ee7b7]">{value}</p>
      <p className="mt-1 font-mono text-[8px] text-[#1e293b]">{sub}</p>
    </div>
  );
}

function KnowledgeExpertVisual() {
  return (
    <div className="relative flex h-full items-center justify-center px-[18px] py-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(16,185,129,.022) 18px,rgba(16,185,129,.022) 19px)' }}
      />
      <div className="absolute left-[18px] top-3 font-mono text-[9px] tracking-[1px] text-[#1e293b]">ENTERPRISE DATA FLOW</div>
      <div className="z-[1] flex w-full items-center">
        <FlowNode label="SOURCE" value="Pega DXB" sub="REST API" />
        <div className="flex flex-[0_0_28px] items-center justify-center">
          <div className="h-0.5 w-full rounded-sm" style={{ animation: 'connGlow 1.8s ease infinite' }} />
        </div>
        <FlowNode label="ENGINE" value="Parser" sub="Real-time" grow />
        <div className="flex flex-[0_0_28px] items-center justify-center">
          <div className="h-0.5 w-full rounded-sm" style={{ animation: 'connGlow 1.8s .6s ease infinite' }} />
        </div>
        <FlowNode label="TARGET" value="HR Spark" sub="GraphQL" />
      </div>
    </div>
  );
}

function EDFVisual() {
  const stage = (label: string, color: string) => (
    <div className="flex-1 rounded-md border border-[rgba(249,115,22,.18)] bg-[rgba(249,115,22,.07)] px-1 py-[7px] text-center">
      <p className="font-mono text-[9px]" style={{ color }}>{label}</p>
    </div>
  );
  return (
    <div className="relative flex h-full flex-col justify-center gap-3.5 overflow-hidden p-[18px]">
      <div className="absolute right-3 top-[11px] flex items-center gap-1.5 rounded-full border border-[rgba(249,115,22,.28)] bg-[rgba(249,115,22,.1)] px-2.5 py-[3px]">
        <span className="font-mono text-xs font-bold text-[#fb923c]">−40%</span>
        <span className="font-mono text-[9px] text-[#475569]">deploy time</span>
      </div>
      <div className="flex w-full items-center">
        {stage('SOURCE', '#475569')}
        <div className="h-px flex-[0_0_10px] bg-[rgba(249,115,22,.3)]" />
        {stage('BUILD ✓', '#6ee7b7')}
        <div className="h-px flex-[0_0_10px] bg-[rgba(249,115,22,.3)]" />
        {stage('TEST ✓', '#6ee7b7')}
        <div className="h-px flex-[0_0_10px] bg-[rgba(249,115,22,.3)]" />
        <div className="flex-1 rounded-md border border-[rgba(16,185,129,.28)] bg-[rgba(16,185,129,.1)] px-1 py-[7px] text-center">
          <p className="font-mono text-[9px] text-[#6ee7b7]">DEPLOY ✓</p>
        </div>
      </div>
      <div className="pl-0.5 font-mono text-[9px] leading-[1.9] text-[#1e293b]">
        <p>&gt; pipeline #2847 triggered on merge</p>
        <p>&gt; tests: <span className="text-[#6ee7b7]">passed</span> · coverage: <span className="text-[#6ee7b7]">94%</span></p>
        <p>&gt; deployed to <span className="text-[#fb923c]">prod</span> in <span className="text-[#fb923c]">4m 12s</span></p>
      </div>
    </div>
  );
}

function FreelanceVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-[18px] font-mono text-[10px] leading-[1.7]">
      <p className="text-[#334155]">$ nest generate resource projects</p>
      <p className="text-[#22d3ee]">CREATE <span className="text-[#475569]">src/projects/projects.controller.ts</span></p>
      <p className="text-[#22d3ee]">CREATE <span className="text-[#475569]">src/projects/projects.service.ts</span></p>
      <p className="text-[#6ee7b7]">✓ REST API · React client · Docker deploy</p>
      <p className="text-[#475569]">$ <span className="cursor-blink text-[#22d3ee]">_</span></p>
    </div>
  );
}

/* ---------- Section ---------- */

export function Projects() {
  const { projects } = usePortfolioStore();
  const byId = (id: string) => projects.find((p) => p.id === id);
  const featured = byId('1');
  const aia = byId('3');
  const ke = byId('2');
  const edf = byId('4');
  const freelance = byId('5');

  return (
    <section id="projects" className="relative z-[1] scroll-mt-16 bg-black/20 py-[120px]">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-12 lg:px-[72px]">
        <div className="mb-[72px]">
          <p className="mb-3.5 font-mono text-xs tracking-[2.5px] text-[var(--color-accent)]">// WORK HISTORY</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(34px,3.5vw,52px)] font-bold tracking-[-1.5px]">Projects &amp; Experience</h2>
            <p className="font-mono text-[13px] text-[#334155]">total {projects.length}</p>
          </div>
        </div>

        {featured && <FeaturedCard p={featured} />}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {aia && <GridCard p={aia} delay={100} visual={<AIAVisual />} />}
          {ke && <GridCard p={ke} delay={200} visual={<KnowledgeExpertVisual />} />}
          {edf && <GridCard p={edf} delay={300} visual={<EDFVisual />} />}
          {freelance && <GridCard p={freelance} delay={400} visual={<FreelanceVisual />} />}
        </div>
      </div>
    </section>
  );
}
