/**
 * App layer barrel export.
 *
 * The app layer is the imperative shell — it adapts browser APIs,
 * manages persistence, dispatches commands, and wires everything
 * together via the composition root.
 *
 * @pattern Functional Core, Imperative Shell
 */

// Adapters
export * from './adapters';

// Null objects
export * from './nullObjects';

// Repositories
export * from './repositories';

// Commands
export * from './commands';

// Event log
export * from './eventLog';

// Composition root
export { createAppContainer, type AppContainer } from './compositionRoot';
