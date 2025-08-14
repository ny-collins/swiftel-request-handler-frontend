import { FiMenu } from 'react-icons/fi';
import NotificationBell from '../../features/notifications/components/NotificationBell';
import UserMenu from '../../features/account/components/UserMenu';
import Breadcrumbs from './Breadcrumbs';

interface TopbarProps {
    toggleSidebar: () => void;
}

const Topbar = ({ toggleSidebar }: TopbarProps) => {
    return (
        <header className="top-navbar">
            <button onClick={toggleSidebar} className="hamburger-menu" aria-label="Toggle sidebar">
                <FiMenu />
            </button>
            <Breadcrumbs />
            <div className="top-navbar-right-section">
                <NotificationBell />
                <UserMenu />
            </div>
        </header>
    );
};

export default Topbar;