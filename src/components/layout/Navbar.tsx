import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiGrid, FiPlusSquare, FiEye, FiUsers, FiUser, FiLogIn } from 'react-icons/fi';

interface NavbarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const NavItem = ({ to, icon, label, toggleSidebar, isSidebarOpen }: any) => {
    const baseClasses = 'flex items-center p-3 my-1 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-colors duration-200';
    const activeClasses = 'bg-purple-100 text-purple-700 font-semibold';

    const handleLinkClick = () => {
        if (window.innerWidth < 1024 && isSidebarOpen) {
            toggleSidebar();
        }
    };

    return (
        <li>
            <NavLink 
                to={to} 
                onClick={handleLinkClick}
                className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ''}`}
            >
                {icon}
                <span className={`overflow-hidden transition-all duration-200 ${isSidebarOpen ? 'w-40 ml-3' : 'w-0'}`}>{label}</span>
            </NavLink>
        </li>
    );
};

const Navbar = ({ isSidebarOpen, toggleSidebar }: NavbarProps) => {
    const { user } = useAuth();

    return (
        <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <FiLogIn className={`text-3xl text-purple-600 transition-transform duration-300 ${isSidebarOpen ? '' : 'transform -rotate-180'}`} />
                <h1 className={`text-2xl font-bold text-purple-600 overflow-hidden transition-all duration-200 ${isSidebarOpen ? 'w-32 ml-2' : 'w-0'}`}>Swiftel</h1>
            </div>
            <nav className="flex-grow px-3 py-4">
                <ul className="space-y-1">
                    <NavItem to="/dashboard" icon={<FiGrid size={24} />} label="Dashboard" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                    
                    {user?.role === 'employee' && (
                        <>
                            <NavItem to="/make-request" icon={<FiPlusSquare size={24} />} label="Make Request" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                            <NavItem to="/my-requests" icon={<FiEye size={24} />} label="My Requests" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                        </>
                    )}

                    {(user?.role === 'admin' || user?.role === 'board_member') && (
                        <>
                            <NavItem to="/requests" icon={<FiEye size={24} />} label="All Requests" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                            <NavItem to="/users" icon={<FiUsers size={24} />} label="Users" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                        </>
                    )}
                    
                    <NavItem to="/account" icon={<FiUser size={24} />} label="My Account" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                </ul>
            </nav>
        </aside>
    );
};

export default Navbar;
