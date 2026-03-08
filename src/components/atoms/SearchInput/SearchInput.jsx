import { useRef, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedInput } from '../../../hooks/useDebouncedInput';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';
import styles from './SearchInput.module.css';

const SearchInput = memo(function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  const inputRef = useRef(null);
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

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchInput;
