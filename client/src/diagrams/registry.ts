import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { DiagramId } from '../portfolio.config';

/**
 * DiagramId → lazily loaded trace (ADR-0002/0004). Import only from the /architecture page,
 * so no trace code reaches the home bundle.
 * Partial until #24 adds the CI/CD and strangler-fig traces; then it becomes a full Record.
 */
export const diagrams: Partial<Record<DiagramId, LazyExoticComponent<ComponentType>>> = {
  'event-pipeline': lazy(() => import('./eventPipeline')),
};
