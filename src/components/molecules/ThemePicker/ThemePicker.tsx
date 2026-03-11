import { memo } from 'react';
import { THEME_MODES, THEME_PALETTES, MODE_LABELS } from '../../../constants/themeMeta';
import type { ThemeMode, ThemePalette } from '../../../types';
import styles from './ThemePicker.module.css';

const MODE_ICONS: Record<ThemeMode, string> = { system: '💻', dark: '🌙', light: '☀️' };

interface ThemePickerProps {
  mode: ThemeMode;
  palette: ThemePalette;
  onModeChange: (mode: ThemeMode) => void;
  onPaletteChange: (palette: ThemePalette) => void;
}

/**
 * Molecule: compact theme controls for mode (system/dark/light)
 * and palette (default + colorblind-safe options).
 */
const ThemePicker = memo(function ThemePicker({
  mode,
  palette,
  onModeChange,
  onPaletteChange,
}: ThemePickerProps) {
  return (
    <div className={styles.picker} role="group" aria-label="Theme settings">
      <div className={styles.segment} role="radiogroup" aria-label="Color mode">
        {THEME_MODES.map((m) => (
          <button
            key={m}
            className={`${styles.segBtn} ${m === mode ? styles.active : ''}`}
            onClick={() => onModeChange(m)}
            role="radio"
            aria-checked={m === mode}
            title={`${MODE_LABELS[m]} mode`}
          >
            <span className={styles.modeIcon} aria-hidden="true">
              {MODE_ICONS[m]}
            </span>
            <span className={styles.modeLabel}>{MODE_LABELS[m]}</span>
          </button>
        ))}
      </div>

      <select
        className={styles.paletteSelect}
        value={palette}
        onChange={(e) => onPaletteChange(e.target.value as ThemePalette)}
        aria-label="Color palette"
      >
        {THEME_PALETTES.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default ThemePicker;
