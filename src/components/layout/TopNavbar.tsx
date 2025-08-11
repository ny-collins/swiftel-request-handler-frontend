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
            <div className="top-navbar-left">
                <button onClick={toggleSidebar} className="hamburger-menu" aria-label="Toggle sidebar">
                    <FiMenu />
                </button>
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
