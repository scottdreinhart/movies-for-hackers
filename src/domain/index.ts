/**
 * Domain layer barrel export.
 *
 * The domain layer is the functional core — pure logic,
 * no framework dependencies, no side effects, no browser APIs.
 *
 * @pattern Functional Core, Imperative Shell
 * @pattern Hexagonal Architecture / Ports & Adapters
 */

// Ports (interfaces — what the domain NEEDS from the outside world)
export type { StoragePort, HapticsPort, MediaQueryPort, ServiceWorkerPort, ThemePort } from './ports';

// Types (discriminated unions, commands, events, branded types)
export * from './types';

// Contracts (invariant assertions)
export * from './contracts';

// Policies (configurable rules and constants)
export * from './policies';

// State Machine
export * from './state';

// Events (event bus)
export { createEventBus, type EventBus } from './events';

// Selectors (CQRS-lite read models)
export * from './selectors';

// Strategies (interchangeable algorithms)
export * from './strategies';

// Feature Flags
export * from './featureFlags';
