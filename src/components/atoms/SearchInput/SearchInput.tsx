import { useRef, memo, useCallback } from 'react';
import { useDebouncedInput } from '../../../hooks/useDebouncedInput';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = memo(function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [local, handleChange] = useDebouncedInput(value, onChange);

  const focusInput = useCallback(() => inputRef.current?.focus(), []);
  useKeyboardShortcut('/', focusInput);

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        aria-label={placeholder}
      />
    </div>
  );
});

export default SearchInput;
