/**
 * Local event bus for domain events.
 *
 * A lightweight, synchronous pub/sub system for internal events.
 * NOT an enterprise event bus — just a clean way for side-effect
 * subscribers (persistence, sounds, analytics, logging) to react
 * to meaningful domain events without coupling to the source.
 *
 * @pattern Event-Driven Architecture (local)
 */

import type { DomainEvent, DomainEventType } from '../types/events';

type Listener<T extends DomainEvent = DomainEvent> = (event: T) => void;

/**
 * Create a new event bus instance.
 * Each bus is independent — useful for testing.
 */
export function createEventBus() {
  const listeners = new Map<DomainEventType | '*', Set<Listener>>();

  function on<T extends DomainEvent>(type: T['type'] | '*', listener: Listener<T>): () => void {
    if (!listeners.has(type)) {
      listeners.set(type, new Set());
    }
    const set = listeners.get(type)!;
    set.add(listener as Listener);

    // Return unsubscribe function
    return () => {
      set.delete(listener as Listener);
      if (set.size === 0) listeners.delete(type);
    };
  }

  function emit(event: DomainEvent): void {
    // Notify type-specific listeners
    const specific = listeners.get(event.type);
    if (specific) {
      for (const listener of specific) {
        listener(event);
      }
    }

    // Notify wildcard listeners
    const wildcards = listeners.get('*');
    if (wildcards) {
      for (const listener of wildcards) {
        listener(event);
      }
    }
  }

  function clear(): void {
    listeners.clear();
  }

  function listenerCount(type?: DomainEventType | '*'): number {
    if (type) {
      return listeners.get(type)?.size ?? 0;
    }
    let total = 0;
    for (const set of listeners.values()) {
      total += set.size;
    }
    return total;
  }

  return { on, emit, clear, listenerCount };
}

/** Type of the event bus returned by `createEventBus()`. */
export type EventBus = ReturnType<typeof createEventBus>;
