export type Accent = 'cyan' | 'blue' | 'green' | 'violet' | 'orange';

export interface ProjectConfig {
  id: string;
  title: string;
  description: string;
  role?: string;
  tech?: string[];
  /** Short display name shown on the landing card (e.g. "Stellantis Motorsport"). */
  name?: string;
  accent?: Accent;
  /** e.g. "2023–2025" — shown next to the role on the featured card. */
  period?: string;
}

export interface SkillConfig {
  name: string;
  pct: number;
}

export interface SkillCategoryConfig {
  title: string;
  subtitle: string;
  icon: string;
  accent: Accent;
  skills: SkillConfig[];
}

/** Canonical headline figures (ADR-0001). Every stat surface reads from `figures`. */
export type FigureId =
  | 'pipelineThroughput'
  | 'pipelineLatency'
  | 'pipelineUptime'
  | 'deployTime'
  | 'testCoverage'
  | 'bugReports'
  | 'sprintAcceptance';

export interface Figure {
  value: string;
  label: string;
}

/** Section anchor on /architecture and diagram registry key — a public URL contract (ADR-0005). */
export type DiagramId = 'event-pipeline' | 'cicd-pipeline' | 'strangler-fig';
export type CaseStudyTag = 'Performance' | 'Reliability' | 'Architect';

/** Anonymous case study (ADR-0001/0002). List order is page order. */
export interface CaseStudyConfig {
  id: DiagramId;
  tag: CaseStudyTag;
  title: string;
  /** Role title + scope owned; the only first-person line (ADR-0007). */
  roleLine: string;
  problem: string;
  /** `term` renders as a bold lead. */
  decisions: { term: string; text: string }[];
  result: { figures: FigureId[]; text: string };
  diagram: DiagramId;
  /** Required text alternative for the trace. */
  diagramText: string;
}

export interface ArchitecturePageConfig {
  headline: string;
  intro: string;
  closing: string;
  teaser: { subtitle: string; linkText: string };
}

export interface SocialConfig {
  label: string;
  href: string;
}

export interface PortfolioConfig {
  meta: {
    name: string;
    firstName: string;
    role: string;
    /** Eyebrow above the hero headline, e.g. "SPECIALISATION". */
    specialisation: string;
    /** Hero headline split into lines; the middle line is accented. */
    headlineLines: string[];
    tagline: string;
    roles: string[];
    description: string;
  };
  skills: string[];
  skillCategories: SkillCategoryConfig[];
  projects: ProjectConfig[];
  figures: Record<FigureId, Figure>;
  caseStudies: CaseStudyConfig[];
  architecturePage: ArchitecturePageConfig;
  socials: SocialConfig[];
  aboutParagraphs: string[];
}

const config: PortfolioConfig = {
  meta: {
    name: 'Amir SAOUDI',
    firstName: 'Amir',
    role: 'Full Stack Engineer | DevOps & Web Security',
    specialisation: 'SPECIALISATION',
    headlineLines: ['Systems Architect', 'Performance Specialist', 'Reliability Engineer.'],
    tagline:
      'I build real-time systems that power split-second decisions — from motorsport strategy engines to video communication platforms.',
    roles: [
      'Full Stack Engineer',
      'DevOps & Web Security',
      'Software Architect',
      'Technical Lead',
      'System Design',
    ],
    description: 'Full Stack Developer — real-time systems, DevOps, Web Security',
  },
  skills: [
    'TypeScript',
    'Node.js',
    'NestJS',
    'WebSockets',
    'Express.js',
    'Vue',
    'React',
    'PostgreSQL',
    'MongoDB',
    'RabbitMQ',
    'Redis',
    'Python',
    'WebRTC',
    'Lit',
    'MySQL',
    'Docker',
    'AWS',
    'Azure',
    'GitLab CI/CD',
    'GitHub Actions',
    'Datadog',
    'REST API',
  ],
  skillCategories: [
    {
      title: 'Frontend',
      subtitle: 'UI · Real-time · WebRTC',
      icon: '◈',
      accent: 'cyan',
      skills: [
        { name: 'React', pct: 93 },
        { name: 'TypeScript', pct: 90 },
        { name: 'WebRTC', pct: 82 },
        { name: 'WebSockets', pct: 86 },
      ],
    },
    {
      title: 'Backend',
      subtitle: 'APIs · Messaging · DBs',
      icon: '⬡',
      accent: 'blue',
      skills: [
        { name: 'Node.js / Express', pct: 93 },
        { name: 'NestJS', pct: 88 },
        { name: 'PostgreSQL', pct: 84 },
        { name: 'RabbitMQ', pct: 78 },
        { name: 'MongoDB', pct: 76 },
      ],
    },
    {
      title: 'DevOps & CI/CD',
      subtitle: 'Pipelines · Containers · Cloud',
      icon: '▣',
      accent: 'green',
      skills: [
        { name: 'GitLab CI/CD', pct: 88 },
        { name: 'Docker / Portainer', pct: 82 },
        { name: 'GitHub Actions', pct: 80 },
        { name: 'Jenkins', pct: 73 },
      ],
    },
    {
      title: 'Testing & Tools',
      subtitle: 'Quality · Observability · Auth',
      icon: '◎',
      accent: 'violet',
      skills: [
        { name: 'JWT / Auth', pct: 87 },
        { name: 'REST API Design', pct: 90 },
        { name: 'Datadog', pct: 78 },
        { name: 'Mocha / Testing', pct: 80 },
      ],
    },
  ],
  projects: [
    {
      id: '1',
      name: 'Stellantis Motorsport',
      title: 'Senior Full Stack Engineer at Stellantis Motorsport',
      description:
        'Event orchestration engine powering real-time F1 race strategy. Built end-to-end: ingesting 50k+ telemetry events per second through to the live decision dashboard used by race engineers at the pit wall.',
      role: 'Senior Full Stack Engineer',
      period: '2023–2025',
      accent: 'blue',
      tech: ['TypeScript', 'React', 'RabbitMQ', 'Node.js', 'Datadog', 'WebSockets'],
    },
    {
      id: '2',
      name: 'Knowledge Expert',
      title: 'Hybrid Full Stack Developer at Knowledge Expert',
      description:
        'Real-time enterprise parsing pipeline — integrated Pega DXB API and HR Spark for seamless data flows across business units.',
      role: 'Hybrid Full Stack Developer',
      accent: 'green',
      tech: ['Keystone.js', 'PostgreSQL', 'Node.js', 'REST API'],
    },
    {
      id: '3',
      name: 'AIA Sports',
      title: 'Full Stack Developer at AIA Sports',
      description:
        'P2P video platform on WebRTC — signalling server, admin portal, real-time chat. Owned the full lifecycle from architecture to production.',
      role: 'Full Stack Developer',
      accent: 'violet',
      tech: ['WebRTC', 'WebSockets', 'Node.js', 'MongoDB'],
    },
    {
      id: '4',
      name: 'EDF Energy',
      title: 'Backend Developer at EDF',
      description:
        'Optimised CI/CD pipelines across Digital PaaS platforms, cutting deployment time by 40% and improving release reliability across multiple squads.',
      role: 'Backend Developer',
      accent: 'orange',
      tech: ['GitLab CI/CD', 'Jenkins', 'Docker', 'MySQL'],
    },
    {
      id: '5',
      name: 'Freelance & Side Projects',
      title: 'Full Stack Web Developer — Freelance',
      description:
        'End-to-end web apps for small businesses and personal products — from NestJS APIs and React frontends to deployment, built and shipped solo.',
      role: 'Full Stack Web Developer',
      accent: 'cyan',
      tech: ['NestJS', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
    },
  ],
  figures: {
    pipelineThroughput: { value: '50k+', label: 'events/s' },
    pipelineLatency: { value: '<50ms', label: 'avg latency' },
    pipelineUptime: { value: '24/7', label: 'uptime' },
    deployTime: { value: '−40%', label: 'deploy time' },
    testCoverage: { value: '80%+', label: 'test coverage' },
    bugReports: { value: '−30%', label: 'bug reports' },
    sprintAcceptance: { value: '>95%', label: 'sprint acceptance' },
  },
  // Copy is verbatim from ADR-0007; edit there first.
  caseStudies: [
    {
      id: 'event-pipeline',
      tag: 'Performance',
      title: 'High-throughput real-time event pipeline',
      roleLine: 'Senior Full Stack Engineer — I built it ingest to dashboard, end to end.',
      problem:
        'Deliver live data from thousands of concurrent sources to operator dashboards with sub-50ms end-to-end latency, and drop nothing under peak load.',
      decisions: [
        { term: 'Message queue', text: 'decouples producers from consumers, so load spikes never push back on the ingest layer.' },
        { term: 'Event orchestrator', text: 'fans processed events out over WebSockets; each client subscribes only to its scope, keeping payloads small.' },
        { term: 'Horizontal consumers', text: 'throughput scales by adding instances, not by re-architecting.' },
      ],
      result: { figures: ['pipelineThroughput', 'pipelineLatency', 'pipelineUptime'], text: 'No message loss in peak-load tests.' },
      diagram: 'event-pipeline',
      diagramText:
        'Data producers send 50k+ events per second to an ingest gateway, which hands them to a message queue. An event orchestrator consumes the queue, enriches events from a cache, and fans out to a WebSocket gateway for live state and a REST API for replay. Both feed the operator dashboards.',
    },
    {
      id: 'cicd-pipeline',
      tag: 'Reliability',
      title: 'Industrialised CI/CD delivery pipeline',
      roleLine: 'Backend Developer — I designed the pipeline and rolled it out.',
      problem: 'Manual deployments were slow and error-prone. Every release was a risk event.',
      decisions: [
        { term: 'Parallel stages', text: 'lint, type-check and unit tests run concurrently, cutting pipeline wall time.' },
        { term: 'One container image', text: 'promoted through every environment, so what you test is what you ship.' },
        { term: 'Prod-like staging', text: 'de-risks each release before it touches production.' },
      ],
      result: { figures: ['deployTime', 'testCoverage'], text: 'No rollback-causing regressions after rollout.' },
      diagram: 'cicd-pipeline',
      diagramText:
        'A push runs lint, type-check and tests in parallel, then builds one Docker image and deploys it to a prod-like staging environment. Smoke and acceptance tests decide: on pass, a zero-downtime production deploy followed by monitoring; on fail, an automatic rollback and an alert.',
    },
    {
      id: 'strangler-fig',
      tag: 'Architect',
      title: 'Incremental legacy modernisation',
      roleLine: 'Full Stack Developer — I set the migration strategy and built its tooling.',
      problem:
        'A weakly typed, heterogeneous legacy frontend kept generating bugs and slowing the team. A full rewrite was impossible: the system had to keep serving users throughout.',
      decisions: [
        { term: 'Strangler fig', text: 'new features ship in the new stack and old components migrate opportunistically — no big-bang rewrite, no feature freeze.' },
        { term: 'TypeScript', text: 'strict typing catches whole bug classes at compile time instead of in production.' },
        { term: 'Shared component library', text: 'Storybook makes the new path the easiest path for every developer.' },
      ],
      result: { figures: ['bugReports', 'sprintAcceptance'], text: 'No release freeze during the migration.' },
      diagram: 'strangler-fig',
      diagramText:
        'The codebase is audited for bug hotspots and its types and contracts defined. Then a loop: build the next component in the new stack, run it in parallel on real traffic, retire the legacy part, and repeat until everything is migrated.',
    },
  ],
  architecturePage: {
    headline: 'What breaks first under pressure?',
    intro:
      'Three architectures for three recurring engineering problems: high-throughput real-time data, unreliable releases, and legacy erosion.',
    closing:
      'Every design here started from one question: what breaks first under pressure? The pipeline absorbs it, the release gate prevents it, the migration isolates it.',
    teaser: { subtitle: 'Three systems, and how each one holds up.', linkText: 'Read the case studies →' },
  },
  socials: [
    { label: 'GitHub', href: 'https://github.com/MirouBagui' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/amir-saoudi05' },
    { label: 'Email', href: 'mailto:saoudi.amire@gmail.com' },
  ],
  aboutParagraphs: [
    "I'm a Full Stack Developer with expertise in React and Node.js, ensuring seamless user experiences and robust backend performance.",
    'Crafting real-time web systems that drive split-second decisions, from motorsport strategy to video communication platforms.',
    'I bridge the gap between data and operations, building intuitive dashboards and secure, reliable workflows that turn complex systems into clear decisions.',
  ],
};

export default config;
