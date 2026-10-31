import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { DiagramId } from '../portfolio.config';

/**
 * DiagramId → lazily loaded trace (ADR-0002/0004). Import only from the /architecture page,
 * so no trace code reaches the home bundle.
 * A full Record: a case study whose DiagramId has no trace fails `tsc`.
 */
export const diagrams: Record<DiagramId, LazyExoticComponent<ComponentType>> = {
  'event-pipeline': lazy(() => import('./eventPipeline')),
  'cicd-pipeline': lazy(() => import('./cicdPipeline')),
  'strangler-fig': lazy(() => import('./stranglerFig')),
};
