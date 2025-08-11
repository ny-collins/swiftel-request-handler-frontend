import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import NotificationBell from './NotificationBell';
import Breadcrumbs from './Breadcrumbs';
import UserMenu from './UserMenu';

interface TopNavbarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

const TopNavbar = ({ toggleSidebar, isSidebarOpen }: TopNavbarProps) => {
    const [showToggleButton, setShowToggleButton] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setShowToggleButton(window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className="top-navbar">
            <div className="top-navbar-left-section">
                {showToggleButton ? (
                    <button onClick={toggleSidebar} className="hamburger-menu">
                        {isSidebarOpen ? <FiX /> : <FiMenu />}
                    </button>
                ) : (
                    // This placeholder is important for alignment when the button is hidden
                    <div className="top-navbar-placeholder"></div>
                )}
                <Breadcrumbs />
            </div>

            <div className="top-navbar-right-section">
                <NotificationBell />
                <UserMenu />
            </div>
        </header>
    );
};

export default TopNavbar;