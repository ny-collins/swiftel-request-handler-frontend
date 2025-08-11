import { useState, useRef, useEffect, ReactNode, SelectHTMLAttributes } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Select = ({ options, value, onChange, placeholder = 'Select an option', ...props }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={selectRef}>
      <button 
        type="button" 
        className="custom-select-value" 
        onClick={() => setIsOpen(!isOpen)}
        disabled={props.disabled}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <FiChevronDown className={`custom-select-arrow ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <ul className="custom-select-options">
          {options.map(option => (
            <li 
              key={option.value} 
              className={`custom-select-option ${option.value === value ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
