/**
 * Finite State Machine for application lifecycle.
 *
 * Defines legal states and legal transitions, preventing
 * impossible state changes.  The UI consumes the current phase
 * via the discriminated union `AppPhase`.
 *
 * @pattern Finite State Machine
 * @pattern Exhaustive State Modeling with Discriminated Unions
 */

import type { AppPhase } from '../types/appPhase';
import type { MovieEntry } from '../../types';

// ── Transition events (not domain events — FSM inputs) ─────────

export type FSMTransition =
  | { readonly type: 'START_LOADING' }
  | { readonly type: 'LOAD_SUCCESS'; readonly entries: ReadonlyArray<MovieEntry> }
  | { readonly type: 'LOAD_FAILURE'; readonly error: Error }
  | { readonly type: 'RESET' };

// ── Legal transition matrix ────────────────────────────────────

/**
 * Transition the FSM.  Returns a new phase or `null` if the
 * transition is illegal from the current state.
 */
export function transition(current: AppPhase, event: FSMTransition): AppPhase | null {
  switch (event.type) {
    case 'START_LOADING':
      // Can start loading from idle or error
      if (current.type === 'idle' || current.type === 'error') {
        return { type: 'loading' };
      }
      return null;

    case 'LOAD_SUCCESS':
      // Can only succeed from loading
      if (current.type === 'loading') {
        return { type: 'ready', entries: event.entries };
      }
      return null;

    case 'LOAD_FAILURE':
      // Can only fail from loading
      if (current.type === 'loading') {
        return {
          type: 'error',
          error: event.error,
          staleEntries: undefined,
        };
      }
      return null;

    case 'RESET':
      return { type: 'idle' };
  }
}

/**
 * Strict version — throws on illegal transitions instead of
 * returning null.  Use in contexts where an illegal transition
 * indicates a programming error.
 */
export function transitionStrict(current: AppPhase, event: FSMTransition): AppPhase {
  const next = transition(current, event);
  if (next === null) {
    throw new Error(
      `[FSM] Illegal transition: cannot apply "${event.type}" in phase "${current.type}"`,
    );
  }
  return next;
}

// ── Phase predicate helpers ────────────────────────────────────

export function canLoad(phase: AppPhase): boolean {
  return phase.type === 'idle' || phase.type === 'error';
}

export function isInteractive(phase: AppPhase): boolean {
  return phase.type === 'ready';
}
