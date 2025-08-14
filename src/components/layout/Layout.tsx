import { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prevState => !prevState);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`app-layout ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
            <Sidebar isSidebarOpen={isSidebarOpen} />
            <div className="main-content-wrapper">
                <Topbar toggleSidebar={toggleSidebar} />
                <main className="main-content">
                    <div className="page-container">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;