import { Code, Globe, Mail } from 'lucide-react';
import { create } from 'zustand';
import config from '../portfolio.config';
import type { Accent, SkillCategoryConfig } from '../portfolio.config';

// Icon derived from the href, not the display label, so config renames
// can't silently swap icons.
function iconFor(href: string): React.ComponentType<{ size?: number; }> {
  if (href.startsWith('mailto:')) return Mail;
  if (href.includes('github.com')) return Code;
  return Globe;
}

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
  skillCategories: SkillCategoryConfig[];
  projects: Project[];
  socials: { label: string; href: string; icon: React.ComponentType<{ size?: number; }>; }[];
  config: typeof config;
}

export const usePortfolioStore = create<PortfolioState>(() => ({
  name: config.meta.name,
  role: config.meta.role,
  specialisation: config.meta.specialisation,
  headlineLines: config.meta.headlineLines,
  tagline: config.meta.tagline,
  roles: config.meta.roles,
  skillCategories: config.skillCategories,
  projects: config.projects.map((p) => ({ ...p })),
  socials: config.socials.map((s) => ({
    ...s,
    icon: iconFor(s.href),
  })),
  config,
}));
