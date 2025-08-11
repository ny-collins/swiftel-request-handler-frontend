import { FiMenu } from 'react-icons/fi';
import NotificationBell from './NotificationBell';
import Breadcrumbs from './Breadcrumbs';
import UserMenu from './UserMenu';

interface TopNavbarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

const TopNavbar = ({ toggleSidebar, isSidebarOpen }: TopNavbarProps) => {
    return (
        <header className={`fixed top-0 right-0 h-16 bg-white/70 backdrop-blur-sm border-b border-gray-200 z-30 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:left-64' : 'lg:left-20'}`}>
            <div className="flex items-center justify-between h-full px-4 sm:px-6">
                <div className="flex items-center gap-4">
                    <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Toggle sidebar">
                        <FiMenu className="h-6 w-6 text-gray-600" />
                    </button>
                    <div className="hidden sm:block">
                        <Breadcrumbs />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <UserMenu />
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
