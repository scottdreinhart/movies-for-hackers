/**
 * Settings repository.
 *
 * Encapsulates persistence of general app settings (feature flag
 * overrides, UI preferences, etc.) behind the StoragePort.
 *
 * @pattern Repository Pattern
 */

import type { StoragePort } from '../../domain/ports';
import type { FeatureFlags } from '../../domain/featureFlags';
import { createFlags } from '../../domain/featureFlags';

const SETTINGS_KEY = 'movies-for-hackers-settings';

export interface AppSettings {
  featureOverrides?: Partial<FeatureFlags>;
}

export interface SettingsRepository {
  load(): AppSettings;
  save(settings: AppSettings): void;
  loadFlags(): FeatureFlags;
}

export function createSettingsRepository(storage: StoragePort): SettingsRepository {
  return {
    load(): AppSettings {
      return storage.get<AppSettings>(SETTINGS_KEY) ?? {};
    },

    save(settings: AppSettings): void {
      storage.set(SETTINGS_KEY, settings);
    },

    loadFlags(): FeatureFlags {
      const settings = this.load();
      return createFlags(settings.featureOverrides);
    },
  };
}
