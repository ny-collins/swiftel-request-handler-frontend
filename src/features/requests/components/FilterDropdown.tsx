import { useState, useRef, useEffect } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

interface FilterDropdownProps {
    children: React.ReactNode;
    filterCount: number;
    onClear: () => void;
}

const FilterDropdown = ({ children, filterCount, onClear }: FilterDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

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
        <div className="filter-dropdown" ref={dropdownRef}>
            <button className="btn btn-secondary filter-dropdown-toggle" onClick={toggleDropdown}>
                <FiFilter />
                <span>Filters</span>
                {filterCount > 0 && <span className="filter-count-badge">{filterCount}</span>}
            </button>
            {isOpen && (
                <div className="filter-dropdown-menu">
                    <div className="filter-dropdown-header">
                        <h4>Filter & Sort</h4>
                        <button className="close-btn" onClick={toggleDropdown}><FiX /></button>
                    </div>
                    <div className="filter-dropdown-content">
                        {children}
                    </div>
                    <div className="filter-dropdown-footer">
                        <button className="btn btn-link" onClick={onClear} disabled={filterCount === 0}>Clear Filters</button>
                        <button className="btn btn-primary" onClick={toggleDropdown}>Apply</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
