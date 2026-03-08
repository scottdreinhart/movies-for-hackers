import { useEffect } from 'react';

/**
 * Hook to register a global keyboard shortcut.
 * Automatically skips events when focus is in input/textarea/select elements.
 *
 * @param {string}   key            - The key to listen for (e.g., '/')
 * @param {Function} callback       - Handler to invoke when key is pressed
 * @param {object}   [options]
 * @param {boolean}  [options.ignoreInputs=true] - Skip events from form elements
 */
export function useKeyboardShortcut(key, callback, { ignoreInputs = true } = {}) {
  useEffect(() => {
    const handler = (e) => {
      if (ignoreInputs && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName))
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
