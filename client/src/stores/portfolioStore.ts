import { Code, Globe, Mail } from 'lucide-react';
import { create } from 'zustand';
import config from '../portfolio.config';
import type { Accent, SkillCategoryConfig } from '../portfolio.config';

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
  name?: string;
  accent?: Accent;
  period?: string;
}

export interface PortfolioState {
  name: string;
  role: string;
  specialisation: string;
  headlineLines: string[];
  tagline: string;
  roles: string[];
  skills: string[];
  skillCategories: SkillCategoryConfig[];
  projects: Project[];
  socials: { label: string; href: string; icon: React.ComponentType<{ size?: number; }>; }[];
  aboutParagraphs: string[];
  config: typeof config;
}

export const usePortfolioStore = create<PortfolioState>(() => ({
  name: config.meta.name,
  role: config.meta.role,
  specialisation: config.meta.specialisation,
  headlineLines: config.meta.headlineLines,
  tagline: config.meta.tagline,
  roles: config.meta.roles,
  skills: config.skills,
  skillCategories: config.skillCategories,
  projects: config.projects.map((p) => ({ ...p })),
  socials: config.socials.map((s) => ({
    ...s,
    icon: ICON_MAP[s.label] || Code,
  })),
  aboutParagraphs: config.aboutParagraphs,
  config,
}));
