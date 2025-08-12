import { FiMenu, FiX } from 'react-icons/fi';
import NotificationBell from './NotificationBell';
import Breadcrumbs from './Breadcrumbs';
import UserMenu from './UserMenu';


interface TopNavbarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

const TopNavbar = ({ toggleSidebar, isSidebarOpen }: TopNavbarProps) => {
    return (
        <header className="top-navbar">
            <div className="top-navbar-left-section">
                <button onClick={toggleSidebar} className="hamburger-menu" aria-label="Toggle sidebar">
                    {isSidebarOpen ? <FiX /> : <FiMenu />}
                </button>
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
