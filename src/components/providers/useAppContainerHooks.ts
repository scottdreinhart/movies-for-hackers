/**
 * Convenience hooks for accessing specific parts of the AppContainer.
 *
 * Separated from AppProvider.tsx so the provider component file
 * only exports React components, satisfying react-refresh/only-export-components.
 *
 * @pattern Composition Root (accessor hooks)
 * @pattern Law of Demeter — each hook exposes only the sub-system it governs
 */

import { useAppContainer } from './AppProvider';

export function useEventBus() {
  return useAppContainer().eventBus;
}

export function useFeatureFlags() {
  return useAppContainer().flags;
}

export function useHapticsPort() {
  return useAppContainer().haptics;
}

export function useStoragePort() {
  return useAppContainer().storage;
}

export function useCommandDispatcher() {
  return useAppContainer().commandDispatcher;
}
