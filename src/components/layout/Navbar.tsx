import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiGrid, FiPlusSquare, FiEye, FiUsers, FiUser, FiLogIn } from 'react-icons/fi';

interface NavbarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const NavItem = ({ to, icon, label, toggleSidebar, isSidebarOpen }: any) => {
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
                className={({ isActive }) => `nav-item group ${isActive ? 'active' : ''}`}
            >
                <span className="nav-item-icon">{icon}</span>
                <span className="nav-item-label">{label}</span>
            </NavLink>
        </li>
    );
};

const Navbar = ({ isSidebarOpen, toggleSidebar }: NavbarProps) => {
    const { user } = useAuth();
    const sidebarClasses = `sidebar ${!isSidebarOpen ? 'collapsed' : ''}`;

    return (
        <aside className={sidebarClasses}>
            <div className="sidebar-header">
                <FiLogIn className="sidebar-logo-icon" />
                <h1 className="sidebar-logo-text">Swiftel</h1>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <NavItem to="/dashboard" icon={<FiGrid />} label="Dashboard" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                    
                    {user?.role === 'employee' && (
                        <>
                            <NavItem to="/make-request" icon={<FiPlusSquare />} label="Make Request" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                            <NavItem to="/my-requests" icon={<FiEye />} label="My Requests" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                        </>
                    )}

                    {(user?.role === 'admin' || user?.role === 'board_member') && (
                        <>
                            <NavItem to="/requests" icon={<FiEye />} label="All Requests" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                            <NavItem to="/users" icon={<FiUsers />} label="Users" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                        </>
                    )}
                    
                    <NavItem to="/account" icon={<FiUser />} label="My Account" toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                </ul>
            </nav>
        </aside>
    );
};

export default Navbar;
