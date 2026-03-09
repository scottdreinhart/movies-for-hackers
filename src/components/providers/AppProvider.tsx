/**
 * AppProvider — React context that distributes the composition root
 * container to all child components.
 *
 * This is the bridge between the imperative shell (app layer)
 * and the declarative UI (React components / hooks).
 *
 * @pattern Composition Root
 * @pattern Dependency Injection (lightweight)
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createAppContainer, type AppContainer } from '../../app/compositionRoot';
import type { FeatureFlags } from '../../domain/featureFlags';

// ── Context ────────────────────────────────────────────────────

const AppContainerContext = createContext<AppContainer | null>(null);

// ── Provider ───────────────────────────────────────────────────

interface AppProviderProps {
  /** Optional feature-flag overrides (tests, experiments). */
  flagOverrides?: Partial<FeatureFlags>;
  children: ReactNode;
}

export function AppProvider({ flagOverrides, children }: AppProviderProps) {
  const container = useMemo(
    () => createAppContainer(flagOverrides),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally stable
    [],
  );

  return (
    <AppContainerContext.Provider value={container}>
      {children}
    </AppContainerContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────

/**
 * Access the app container from any component.
 * Must be called inside `<AppProvider>`.
 */
export function useAppContainer(): AppContainer {
  const container = useContext(AppContainerContext);
  if (!container) {
    throw new Error('useAppContainer must be used within <AppProvider>');
  }
  return container;
}
