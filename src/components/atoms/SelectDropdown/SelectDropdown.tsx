import styles from './SelectDropdown.module.css';

interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  placeholder?: string;
}

export default function SelectDropdown({
  value,
  onChange,
  options = [],
  placeholder = '',
}: SelectDropdownProps) {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder || 'Select option'}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
