import { create } from 'zustand'

export interface Project {
  id: string
  title: string
  description: string
  role?: string
  tech?: string[]
}

export interface PortfolioState {
  name: string
  role: string
  tagline: string
  roles: string[]
  skills: string[]
  projects: Project[]
  socials: { label: string; href: string }[]
  aboutParagraphs: string[]
}

export const usePortfolioStore = create<PortfolioState>(() => ({
  name: 'Amir SAOUDI',
  role: 'Full Stack Engineer | DevOps & Web Security',
  tagline:
    'I build real-time systems that power split-second decisions — from motorsport strategy engines to video communication platforms.',
  roles: [
    'Full Stack Engineer',
    'DevOps & Web Security',
    'Real-Time Systems',
    'UI/UX Developer',
  ],
  skills: [
    'TypeScript',
    'React',
    'Vue',
    'Node.js',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'AWS',
    'Azure',
    'GitLab CI/CD',
    'GitHub Actions',
    'Datadog',
    'WebRTC',
    'REST API',
  ],
  projects: [
    {
      id: '1',
      title: 'Real-Time Race Engine',
      description: 'Event orchestration engine handling 50k+ concurrent data points with sub-50ms latency for F1 race strategy.',
      role: 'Full Stack Engineer',
      tech: ['TypeScript', 'React', 'Node.js', 'Docker', 'Portainer'],
    },
    {
      id: '2',
      title: 'Race Operations Dashboard',
      description: 'Full-stack web tools powering real-time strategy and decision support for motorsport race engineers.',
      role: 'Full Stack Engineer',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Datadog'],
    },
    {
      id: '3',
      title: 'Video Messaging Platform',
      description: 'Real-time video messaging platform (WebRTC) with admin portal, from architecture to production.',
      role: 'Full Stack Developer',
      tech: ['WebRTC', 'React', 'Node.js', 'MongoDB', 'JWT'],
    },
    {
      id: '4',
      title: 'CI/CD Pipeline Automation',
      description: 'GitLab CI/CD pipelines reducing deployment time by 40% across Digital PaaS platforms.',
      role: 'Full Stack Developer Jr',
      tech: ['GitLab CI', 'Docker', 'Mocha', 'AngularJS'],
    },
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/MirouBagui' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/amir-saoudi05' },
    { label: 'Email', href: 'mailto:saoudi.amire@gmail.com' },
  ],
  aboutParagraphs: [
    'Full Stack Engineer with expertise in DevOps and web security. Currently building real-time race operations tools at Capgemini / Stellantis Motorsports — architecting systems that process 50k+ concurrent data points with sub-50ms latency for split-second F1 strategy decisions.',
    'Previously delivered a WebRTC video messaging platform end-to-end, reduced deployment time by 40% via GitLab CI/CD automation, and cut frontend bug reports by 30% through rigorous TypeScript implementation.',
    'I bridge the gap between data and operations, building intuitive dashboards and secure, reliable workflows that turn complex systems into clear decisions.',
  ],
}))
