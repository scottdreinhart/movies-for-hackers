import { useEffect } from 'react';

interface ShortcutOptions {
  ignoreInputs?: boolean;
}

/**
 * Hook to register a global keyboard shortcut.
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  { ignoreInputs = true }: ShortcutOptions = {},
): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        ignoreInputs &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (document.activeElement as HTMLElement)?.tagName ?? '',
        )
      )
        return;
      if (e.key === key) {
        e.preventDefault();
        callback();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [key, callback, ignoreInputs]);
}
