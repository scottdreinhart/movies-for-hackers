/**
 * Event logger — records domain events for debugging and replay.
 *
 * Subscribes to the event bus (wildcard) and stores every event
 * in an in-memory log.  Supports snapshotting, querying, and
 * replay foundations.
 *
 * @pattern Snapshot + Replay / Event Log
 */

import type { DomainEvent } from '../../domain/types/events';
import type { EventBus } from '../../domain/events';

export interface EventLogger {
  /** All recorded events, oldest first. */
  readonly log: ReadonlyArray<DomainEvent>;

  /** Take a snapshot of the current log. */
  snapshot(): DomainEvent[];

  /** Clear the log. */
  clear(): void;

  /** Get events of a specific type. */
  ofType<T extends DomainEvent['type']>(type: T): Extract<DomainEvent, { type: T }>[];

  /** Get the last N events. */
  last(n: number): DomainEvent[];

  /** Disconnect from the event bus. */
  disconnect(): void;
}

export function createEventLogger(eventBus: EventBus, maxSize: number = 1000): EventLogger {
  const events: DomainEvent[] = [];

  const unsubscribe = eventBus.on('*', (event: DomainEvent) => {
    events.push(event);
    // Ring buffer: drop oldest when full
    if (events.length > maxSize) {
      events.shift();
    }
  });

  return {
    get log(): ReadonlyArray<DomainEvent> {
      return events;
    },

    snapshot(): DomainEvent[] {
      return [...events];
    },

    clear(): void {
      events.length = 0;
    },

    ofType<T extends DomainEvent['type']>(type: T): Extract<DomainEvent, { type: T }>[] {
      return events.filter((e): e is Extract<DomainEvent, { type: T }> => e.type === type);
    },

    last(n: number): DomainEvent[] {
      return events.slice(-n);
    },

    disconnect(): void {
      unsubscribe();
    },
  };
}
