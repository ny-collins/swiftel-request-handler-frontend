import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiGrid, FiPlusSquare, FiEye, FiUsers, FiUser } from 'react-icons/fi';

interface NavbarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Navbar = ({ isSidebarOpen, toggleSidebar }: NavbarProps) => {
    const { user } = useAuth();

    const handleLinkClick = () => {
        if (window.innerWidth < 1024 && isSidebarOpen) {
            toggleSidebar();
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-header">
                {isSidebarOpen && <h1>Swiftel</h1>}
            </div>
            <ul className="navbar-links">
                <li onClick={handleLinkClick}><NavLink to="/dashboard"><FiGrid />{isSidebarOpen && <span>Dashboard</span>}</NavLink></li>
                
                {user?.role === 'employee' && (
                    <>
                        <li onClick={handleLinkClick}><NavLink to="/make-request"><FiPlusSquare />{isSidebarOpen && <span>Make Request</span>}</NavLink></li>
                        <li onClick={handleLinkClick}><NavLink to="/my-requests"><FiEye />{isSidebarOpen && <span>View My Requests</span>}</NavLink></li>
                    </>
                )}

                {(user?.role === 'admin' || user?.role === 'board_member') && (
                     <>
                        <li onClick={handleLinkClick}><NavLink to="/requests"><FiEye />{isSidebarOpen && <span>View All Requests</span>}</NavLink></li>
                        <li onClick={handleLinkClick}><NavLink to="/users"><FiUsers />{isSidebarOpen && <span>Users</span>}</NavLink></li>
                    </>
                )}
                
                <li onClick={handleLinkClick}><NavLink to="/account"><FiUser />{isSidebarOpen && <span>My Account</span>}</NavLink></li>
            </ul>
        </nav>
    );
};

export default Navbar;
