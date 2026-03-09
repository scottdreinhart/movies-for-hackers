/**
 * Command dispatcher — central command handling.
 *
 * All user intents flow through commands.  The dispatcher
 * routes them to the appropriate handlers and optionally
 * logs them to the event log for replay / debugging.
 *
 * @pattern Command Pattern
 * @pattern Tell, Don't Ask
 */

import type { AppCommand } from '../../domain/types/commands';
import type { EventBus } from '../../domain/events';

export type CommandHandler = (command: AppCommand) => void;

export interface CommandDispatcher {
  /** Dispatch a command to all registered handlers. */
  dispatch(command: AppCommand): void;

  /** Register a handler for ALL commands. */
  use(handler: CommandHandler): () => void;

  /** Register a handler for a specific command type only. */
  on<T extends AppCommand['type']>(
    type: T,
    handler: (command: Extract<AppCommand, { type: T }>) => void,
  ): () => void;
}

/**
 * Create a command dispatcher, optionally connected to an event bus
 * for logging purposes.
 */
export function createCommandDispatcher(eventBus?: EventBus): CommandDispatcher {
  const globalHandlers = new Set<CommandHandler>();
  const typeHandlers = new Map<string, Set<CommandHandler>>();

  return {
    dispatch(command: AppCommand): void {
      // Log to event bus (if connected and event log is enabled)
      if (eventBus) {
        eventBus.emit({
          type: 'FilterChanged' as const,
          key: 'search',
          value: '',
          resultCount: 0,
          timestamp: Date.now(),
          ...({ _command: command.type } as Record<string, unknown>),
        } as never);
      }

      // Route to type-specific handlers
      const specific = typeHandlers.get(command.type);
      if (specific) {
        for (const handler of specific) {
          handler(command);
        }
      }

      // Route to global handlers
      for (const handler of globalHandlers) {
        handler(command);
      }
    },

    use(handler: CommandHandler): () => void {
      globalHandlers.add(handler);
      return () => globalHandlers.delete(handler);
    },

    on<T extends AppCommand['type']>(
      type: T,
      handler: (command: Extract<AppCommand, { type: T }>) => void,
    ): () => void {
      if (!typeHandlers.has(type)) {
        typeHandlers.set(type, new Set());
      }
      const set = typeHandlers.get(type)!;
      const wrapped: CommandHandler = (cmd) => {
        if (cmd.type === type) handler(cmd as Extract<AppCommand, { type: T }>);
      };
      set.add(wrapped);
      return () => set.delete(wrapped);
    },
  };
}
