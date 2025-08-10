import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiGrid, FiPlusSquare, FiEye, FiUsers, FiUser } from 'react-icons/fi';


type ScreenSize = 'small' | 'medium' | 'large';

interface NavbarProps {
    isSidebarOpen: boolean;
    screenSize: ScreenSize;
    toggleSidebar: () => void;
}

const Navbar = ({ isSidebarOpen, screenSize, toggleSidebar }: NavbarProps) => {
    const { user } = useAuth();

    const showLabels = isSidebarOpen || screenSize === 'small';

    const handleLinkClick = () => {
        if (screenSize !== 'large' && isSidebarOpen) {
            toggleSidebar();
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-header">
                {showLabels && <h1>Swiftel</h1>}
            </div>
            <ul className="navbar-links">
                <li onClick={handleLinkClick}><NavLink to="/dashboard"><FiGrid />{showLabels && <span>Dashboard</span>}</NavLink></li>
                
                {user?.role === 'employee' && (
                    <>
                        <li onClick={handleLinkClick}><NavLink to="/make-request"><FiPlusSquare />{showLabels && <span>Make Request</span>}</NavLink></li>
                        <li onClick={handleLinkClick}><NavLink to="/my-requests"><FiEye />{showLabels && <span>View My Requests</span>}</NavLink></li>
                    </>
                )}

                {(user?.role === 'admin' || user?.role === 'board_member') && (
                     <>
                        <li onClick={handleLinkClick}><NavLink to="/requests"><FiEye />{showLabels && <span>View All Requests</span>}</NavLink></li>
                        <li onClick={handleLinkClick}><NavLink to="/users"><FiUsers />{showLabels && <span>Users</span>}</NavLink></li>
                    </>
                )}
                
                <li onClick={handleLinkClick}><NavLink to="/account"><FiUser />{showLabels && <span>My Account</span>}</NavLink></li>
            </ul>
        </nav>
    );
};

export default Navbar;
