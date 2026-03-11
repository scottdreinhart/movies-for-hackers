/**
 * Discriminated-union model for application phases.
 *
 * The app transitions through a strict set of legal phases.
 * Each phase carries only the data relevant to that state,
 * making illegal states unrepresentable.
 *
 * @pattern Exhaustive State Modeling with Discriminated Unions
 * @pattern Finite State Machine
 */

import type { MovieEntry } from '../../types';

// ── Phase discriminated union ──────────────────────────────────

export type AppPhase =
  | { readonly type: 'idle' }
  | { readonly type: 'loading' }
  | { readonly type: 'ready'; readonly entries: ReadonlyArray<MovieEntry> }
  | {
      readonly type: 'error';
      readonly error: Error;
      readonly staleEntries?: ReadonlyArray<MovieEntry>;
    };

// ── Constructors (prevent accidental bare-object creation) ─────

export const AppPhases = {
  idle: (): AppPhase => ({ type: 'idle' }),
  loading: (): AppPhase => ({ type: 'loading' }),
  ready: (entries: ReadonlyArray<MovieEntry>): AppPhase => ({ type: 'ready', entries }),
  error: (error: Error, staleEntries?: ReadonlyArray<MovieEntry>): AppPhase => ({
    type: 'error',
    error,
    staleEntries,
  }),
} as const;

// ── Type guards ────────────────────────────────────────────────

export function isIdle(phase: AppPhase): phase is Extract<AppPhase, { type: 'idle' }> {
  return phase.type === 'idle';
}

export function isLoading(phase: AppPhase): phase is Extract<AppPhase, { type: 'loading' }> {
  return phase.type === 'loading';
}

export function isReady(phase: AppPhase): phase is Extract<AppPhase, { type: 'ready' }> {
  return phase.type === 'ready';
}

export function isError(phase: AppPhase): phase is Extract<AppPhase, { type: 'error' }> {
  return phase.type === 'error';
}

// ── Exhaustive match helper ────────────────────────────────────

export function matchPhase<T>(
  phase: AppPhase,
  handlers: {
    idle: () => T;
    loading: () => T;
    ready: (entries: ReadonlyArray<MovieEntry>) => T;
    error: (error: Error, staleEntries?: ReadonlyArray<MovieEntry>) => T;
  },
): T {
  switch (phase.type) {
    case 'idle':
      return handlers.idle();
    case 'loading':
      return handlers.loading();
    case 'ready':
      return handlers.ready(phase.entries);
    case 'error':
      return handlers.error(phase.error, phase.staleEntries);
  }
}
