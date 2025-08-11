import { FiMenu } from 'react-icons/fi';
import NotificationBell from './NotificationBell';
import Breadcrumbs from './Breadcrumbs';
import UserMenu from './UserMenu';

interface TopNavbarProps {
    toggleSidebar: () => void;
}

const TopNavbar = ({ toggleSidebar }: TopNavbarProps) => {
    return (
        <header className="top-navbar">
            <div className="top-navbar-left-section">
                {showToggleButton ? (
                    <button onClick={toggleSidebar} className="hamburger-menu">
                        {isSidebarOpen ? <FiX /> : <FiMenu />}
                    </button>
                ) : (
                    <div className="top-navbar-placeholder"></div> // Placeholder for alignment
                )}
                <h1 className="top-navbar-title">{pageTitle}</h1>
            </div>

            <div className="top-navbar-right-section">
                <NotificationBell />
            </div>
        </header>
    );
};

export default TopNavbar;
