import { useState, useCallback, type KeyboardEvent } from 'react';

type ScrollAlignment = 'start' | 'center' | 'end' | 'auto';

interface Scrollable {
  scrollToIndex: (index: number, opts?: { align?: ScrollAlignment }) => void;
}

interface DpadOptions {
  itemCount: number;
  virtualizer: Scrollable;
  onActivate?: (index: number) => void;
}

interface DpadResult {
  focusedIndex: number | null;
  containerProps: {
    tabIndex: number;
    role: string;
    'aria-label': string;
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
  };
}

/**
 * Hook for D-pad / arrow-key / remote-control navigation within a virtualized list.
 */
export function useDpadNavigation({ itemCount, virtualizer, onActivate }: DpadOptions): DpadResult {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Clamp focused index when item count shrinks (e.g., after filtering)
  const clampedIndex = focusedIndex !== null && focusedIndex >= itemCount ? null : focusedIndex;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
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
