import { useState, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const location = useLocation();

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prevState => !prevState);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobile && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, isMobile]);

    return (
        <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} />
            <div className="main-content-wrapper">
                <Topbar toggleSidebar={toggleSidebar} />
                <main className="main-content">
                    <div className="page-container">
                        <Outlet />
                    </div>
                </main>
            </div>
            {isSidebarOpen && isMobile && <div className="mobile-overlay" onClick={toggleSidebar}></div>}
        </div>
    );
};

export default Layout;