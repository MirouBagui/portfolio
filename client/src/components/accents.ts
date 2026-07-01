import type { Accent } from '../portfolio.config';

interface AccentTokens {
  /** "r,g,b" so callers can compose rgba() at any alpha */
  rgb: string;
  light: string;
  barFrom: string;
  barTo: string;
}

export const ACCENTS: Record<Accent, AccentTokens> = {
  cyan: { rgb: '6,182,212', light: '#22d3ee', barFrom: '#0891b2', barTo: '#06b6d4' },
  blue: { rgb: '59,130,246', light: '#7dd3fc', barFrom: '#1d4ed8', barTo: '#3b82f6' },
  green: { rgb: '16,185,129', light: '#6ee7b7', barFrom: '#059669', barTo: '#10b981' },
  violet: { rgb: '139,92,246', light: '#c4b5fd', barFrom: '#7c3aed', barTo: '#8b5cf6' },
  orange: { rgb: '249,115,22', light: '#fdba74', barFrom: '#f97316', barTo: '#fb923c' },
};

export const rgba = (a: Accent, alpha: number) => `rgba(${ACCENTS[a].rgb},${alpha})`;
