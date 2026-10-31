import type { FigureId } from '../portfolio.config';

/**
 * A terminal-trace diagram is typed lines of segments (ADR-0004). Each role maps to
 * a theme-token utility in Trace.tsx, so diagram content never carries a colour.
 */
export type Segment =
  | { role: 'node' | 'sublabel' | 'connector'; text: string }
  /** Value always comes from the figures map; `label` may override its label ('' hides it). */
  | { role: 'figure'; id: FigureId; label?: string }
  /** Pass/fail colour, only next to a text label such as ✓/✗ (ADR-0003). */
  | { role: 'status'; tone: 'pass' | 'fail'; text: string };

export type TraceLine = Segment[];

export interface TraceDefinition {
  /** The command shown after the `$` prompt on the first line. */
  command: string;
  lines: TraceLine[];
}

export const node = (text: string): Segment => ({ role: 'node', text });
export const sub = (text: string): Segment => ({ role: 'sublabel', text });
export const con = (text: string): Segment => ({ role: 'connector', text });
export const fig = (id: FigureId, label?: string): Segment => ({ role: 'figure', id, label });
export const pass = (text: string): Segment => ({ role: 'status', tone: 'pass', text });
export const fail = (text: string): Segment => ({ role: 'status', tone: 'fail', text });
