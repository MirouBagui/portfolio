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
        'Event orchestration engine powering real-time F1 race strategy. Built end-to-end: ingesting 50k+ concurrent telemetry data points per second through to the live decision dashboard used by race engineers at the pit wall.',
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
