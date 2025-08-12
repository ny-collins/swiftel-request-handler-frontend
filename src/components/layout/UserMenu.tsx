import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiLogOut } from 'react-icons/fi';


const UserMenu = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getInitials = (name: string) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1 && names[names.length - 1]) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
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
        <div className={`user-menu ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
            <button className="user-avatar-button" onClick={() => setIsOpen(!isOpen)} aria-label="Open user menu">
                {getInitials(user?.username || '')}
            </button>

            {isOpen && (
                <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                        <div className="user-avatar-large">{getInitials(user?.username || '')}</div>
                        <div className="user-info">
                            <strong>{user?.username}</strong>
                            <small>{user?.role?.replace('_', ' ')}</small>
                        </div>
                    </div>
                    <ul className="user-menu-list">
                        <li>
                            <Link to="/account" className="user-menu-item" onClick={() => setIsOpen(false)}>
                                <FiUser />
                                <span>My Account</span>
                            </Link>
                        </li>
                        <li>
                            <button onClick={logout} className="user-menu-item">
                                <FiLogOut />
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
