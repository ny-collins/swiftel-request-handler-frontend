import { FiMenu, FiX } from 'react-icons/fi';
import NotificationBell from './NotificationBell';
import Breadcrumbs from './Breadcrumbs';
import UserMenu from './UserMenu';

type ScreenSize = 'small' | 'medium' | 'large';

interface TopNavbarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    screenSize: ScreenSize;
}

const TopNavbar = ({ toggleSidebar, isSidebarOpen, screenSize }: TopNavbarProps) => {
    const showToggleButton = screenSize !== 'large';

    return (
        <header className="top-navbar">
            <div className="top-navbar-left">
                {showToggleButton ? (
                    <button onClick={toggleSidebar} className="hamburger-menu">
                        {isSidebarOpen ? <FiX /> : <FiMenu />}
                    </button>
                ) : (
                    <div style={{ width: '2rem' }} /> // Placeholder for alignment
                )}
                <Breadcrumbs />
            </div>

            <div className="top-navbar-right">
                <NotificationBell />
                <UserMenu />
            </div>
        </header>
    );
};

export default TopNavbar;
