import { Code, Globe, Mail } from 'lucide-react';
import { create } from 'zustand';

export interface Project {
  id: string;
  title: string;
  description: string;
  role?: string;
  tech?: string[];
}

export interface PortfolioState {
  name: string;
  role: string;
  tagline: string;
  roles: string[];
  skills: string[];
  projects: Project[];
  socials: { label: string; href: string, icon: React.ComponentType<{ size?: number; }>; }[];
  aboutParagraphs: string[];
}

export const usePortfolioStore = create<PortfolioState>(() => ({
  name: 'Amir SAOUDI',
  role: 'Full Stack Engineer | DevOps & Web Security',
  tagline:
    'I build real-time systems that power split-second decisions — from motorsport strategy engines to video communication platforms.',
  roles: [
    'Full Stack Engineer',
    'DevOps & Web Security',
    'Real-Time Web Systems',
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
      tech: ['TypeScript', 'React', 'Node.js', 'RabbitMQ', 'Docker', 'Portainer', 'GitLab CI', 'Datadog'],
    },
    {
      id: '2',
      title: 'Hybrid Full Stack Developer at Knowledge Expert',
      description: 'Full-stack web tools powering real-time parser and support for Pega DXB API & HR spark.',
      role: 'Hybrid Full Stack Developer (UI & API Integration)',
      tech: ['TypeScript', 'React', 'Node.js', 'WebSockets', 'Jenkins', 'PostgreSQL', 'Github Actions'],
    },
    {
      id: '3',
      title: 'Full Stack Developer at AIA Sports',
      description: 'Real-time video messaging platform (WebRTC) with admin portal, from architecture to production.',
      role: 'Full Stack Developer',
      tech: ['WebRTC', 'React', 'Keystone.js', 'MongoDB', 'JWT', "Express.js"],
    },
    {
      id: '4',
      title: 'Full Stack Developer at EDF',
      description: 'Deliver new Features and ensure seamless deployment with GitLab CI/CD pipelines reducing deployment time by 40% across Digital PaaS platforms.',
      role: 'Full Stack Developer',
      tech: ['React', 'AngularJS', 'Docker', 'Mocha', 'GitLab CI/CD', 'GitHub Actions'],
    },
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/MirouBagui', icon: Code },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/amir-saoudi05', icon: Globe },
    { label: 'Email', href: 'mailto:saoudi.amire@gmail.com', icon: Mail },
  ],
  aboutParagraphs: [
    'I\'m a Full Stack Developer with expertise in React and Node.js, ensuring seamless user experiences and robust backend performance.',
    'Crafting real-time web systems that drive split-second decisions, from motorsport strategy to video communication platforms.',
    'I bridge the gap between data and operations, building intuitive dashboards and secure, reliable workflows that turn complex systems into clear decisions.',
  ],
}));
