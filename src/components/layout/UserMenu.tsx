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
        if (names.length > 1) {
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
        <div className="user-menu" ref={dropdownRef}>
            <div className="user-avatar" onClick={() => setIsOpen(!isOpen)}>
                {getInitials(user?.username || '')}
            </div>

            {isOpen && (
                <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                        <strong>{user?.username}</strong>
                        <small>{user?.role?.replace('_', ' ')}</small>
                    </div>
                    <ul>
                        <li>
                            <Link to="/account" onClick={() => setIsOpen(false)}>
                                <FiUser /> My Account
                            </Link>
                        </li>
                        <li>
                            <button onClick={logout}>
                                <FiLogOut /> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserMenu;