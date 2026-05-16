import { Code, Globe, Mail } from 'lucide-react';
import { create } from 'zustand';
import config from '../portfolio.config';
import type { GitHubRepo } from './githubTypes';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; }>> = {
  GitHub: Code,
  LinkedIn: Globe,
  Email: Mail,
};

export interface Project {
  id: string;
  title: string;
  description: string;
  role?: string;
  tech?: string[];
  github?: { url: string; stars: number; forks: number; lang?: string; };
}

export interface PortfolioState {
  name: string;
  role: string;
  tagline: string;
  roles: string[];
  skills: string[];
  projects: Project[];
  socials: { label: string; href: string; icon: React.ComponentType<{ size?: number; }>; }[];
  aboutParagraphs: string[];
  githubRepos: GitHubRepo[];
  config: typeof config;
  setGitHubRepos: (repos: GitHubRepo[]) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  name: config.meta.name,
  role: config.meta.role,
  tagline: config.meta.tagline,
  roles: config.meta.roles,
  skills: config.skills,
  projects: config.projects.map((p) => ({ ...p })),
  socials: config.socials.map((s) => ({
    ...s,
    icon: ICON_MAP[s.label] || Code,
  })),
  aboutParagraphs: config.aboutParagraphs,
  githubRepos: [],
  config,
  setGitHubRepos: (repos) => set({ githubRepos: repos }),
}));
