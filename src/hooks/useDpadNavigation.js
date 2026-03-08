import { useState, useCallback } from 'react';

/**
 * Hook for D-pad / arrow-key / remote-control navigation within a virtualized list.
 *
 * Handles ArrowUp, ArrowDown, Home, End, and Enter keys on the container element.
 * Works with @tanstack/react-virtual — scrolls the virtualizer to keep the
 * focused row visible when navigating off-screen.
 *
 * @param {object}   options
 * @param {number}   options.itemCount   Total number of rows
 * @param {object}   options.virtualizer The virtualizer instance (scrollToIndex)
 * @param {Function} [options.onActivate] Callback invoked with the focused index on Enter key
 * @returns {{ focusedIndex: number|null, containerProps: object }}
 */
export function useDpadNavigation({ itemCount, virtualizer, onActivate }) {
  const [focusedIndex, setFocusedIndex] = useState(null);

  // Clamp focused index when item count shrinks (e.g., after filtering)
  const clampedIndex = focusedIndex !== null && focusedIndex >= itemCount ? null : focusedIndex;

  const handleKeyDown = useCallback(
    (e) => {
      if (itemCount === 0) return;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev === null ? 0 : Math.min(prev + 1, itemCount - 1);
            virtualizer.scrollToIndex(next, { align: 'auto' });
            return next;
          });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev === null ? 0 : Math.max(prev - 1, 0);
            virtualizer.scrollToIndex(next, { align: 'auto' });
            return next;
          });
          break;
        }
        case 'Home': {
          e.preventDefault();
          setFocusedIndex(0);
          virtualizer.scrollToIndex(0, { align: 'start' });
          break;
        }
        case 'End': {
          e.preventDefault();
          const last = itemCount - 1;
          setFocusedIndex(last);
          virtualizer.scrollToIndex(last, { align: 'end' });
          break;
        }
        case 'Enter': {
          if (clampedIndex !== null) {
            onActivate?.(clampedIndex);
          }
          break;
        }
        default:
          break;
      }
    },
    [itemCount, virtualizer, clampedIndex, onActivate],
  );

  const containerProps = {
    tabIndex: 0,
    role: 'grid',
    'aria-label': 'Movie list — use arrow keys to navigate rows, Enter to open',
    onKeyDown: handleKeyDown,
  };

  return { focusedIndex: clampedIndex, containerProps };
}
