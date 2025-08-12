import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiGrid, FiPlusSquare, FiEye, FiUsers, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import './Navbar.css';

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    toggleSidebar: () => void;
}

const NavItem = ({ to, icon, label, toggleSidebar }: NavItemProps) => {
    const handleLinkClick = () => {
        if (window.innerWidth < 1024) {
            toggleSidebar();
        }
    };

    return (
        <NavLink
            to={to}
            onClick={handleLinkClick}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
            <span className="nav-item-icon">{icon}</span>
            <span className="nav-item-label">{label}</span>
        </NavLink>
    );
};

interface NavbarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Navbar = ({ isSidebarOpen, toggleSidebar }: NavbarProps) => {
    const { user, logout } = useAuth();

    return (
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
            <div className="sidebar-header">
                <FiSettings className="sidebar-logo-icon" />
                <h1 className="sidebar-logo-text">Swiftel</h1>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <NavItem to="/dashboard" icon={<FiGrid />} label="Dashboard" toggleSidebar={toggleSidebar} />
                    
                    {user?.role === 'employee' && (
                        <>
                            <NavItem to="/make-request" icon={<FiPlusSquare />} label="Make Request" toggleSidebar={toggleSidebar} />
                            <NavItem to="/my-requests" icon={<FiEye />} label="My Requests" toggleSidebar={toggleSidebar} />
                        </>
                    )}

                    {(user?.role === 'admin' || user?.role === 'board_member') && (
                        <>
                            <NavItem to="/requests" icon={<FiEye />} label="All Requests" toggleSidebar={toggleSidebar} />
                            <NavItem to="/users" icon={<FiUsers />} label="Users" toggleSidebar={toggleSidebar} />
                        </>
                    )}
                    
                    <NavItem to="/account" icon={<FiUser />} label="My Account" toggleSidebar={toggleSidebar} />
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

export default Navbar;
