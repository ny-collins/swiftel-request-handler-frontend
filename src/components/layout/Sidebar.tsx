import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiGrid, FiPlusSquare, FiEye, FiUsers, FiUser, FiLogOut, FiSettings, FiX } from 'react-icons/fi';

interface SidebarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    isMobile: boolean;
}

const Sidebar = ({ isSidebarOpen, toggleSidebar, isMobile }: SidebarProps) => {
    const { user, logout } = useAuth();

    return (
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
            <div className="sidebar-header">
                <FiSettings className="sidebar-logo-icon" />
                <h1 className="sidebar-logo-text">Swiftel</h1>
                {isMobile && (
                    <button onClick={toggleSidebar} className="hamburger-menu" style={{color: 'var(--gray-500)', marginLeft: 'auto'}}>
                        <FiX />
                    </button>
                )}
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li><NavItem to="/dashboard" icon={<FiGrid />} label="Dashboard" /></li>
                    
                    {user?.role === 'employee' && (
                        <>
                            <li><NavItem to="/make-request" icon={<FiPlusSquare />} label="Make Request" /></li>
                            <li><NavItem to="/my-requests" icon={<FiEye />} label="My Requests" /></li>
                        </>
                    )}

                    {(user?.role === 'admin' || user?.role === 'board_member') && (
                        <>
                            <li><NavItem to="/requests" icon={<FiEye />} label="All Requests" /></li>
                            <li><NavItem to="/users" icon={<FiUsers />} label="Users" /></li>
                        </>
                    )}
                    
                    <li><NavItem to="/account" icon={<FiUser />} label="My Account" /></li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                 <button onClick={logout} className="nav-item logout-btn">
                    <span className="nav-item-icon"><FiLogOut /></span>
                    <span className="nav-item-label">Logout</span>
                </button>
            </div>
        </aside>
    );
};

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
            <span className="nav-item-icon">{icon}</span>
            <span className="nav-item-label">{label}</span>
        </NavLink>
    );
};

export default Sidebar;