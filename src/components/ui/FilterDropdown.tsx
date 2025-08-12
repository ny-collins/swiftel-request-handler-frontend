import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './FilterDropdown.css';

interface FilterDropdownProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  options: { value: string; label: string }[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ currentFilter, onFilterChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === currentFilter);

  const handleOptionClick = (value: string) => {
    onFilterChange(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <button 
        type="button" 
        className="custom-select-value"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Filter: {selectedOption?.label || ''}</span>
        <FiChevronDown className={`custom-select-arrow ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <ul className="custom-select-options">
          {options.map((option) => (
            <li
              key={option.value}
              className={`custom-select-option ${option.value === currentFilter ? 'selected' : ''}`}
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

export default FilterDropdown;
