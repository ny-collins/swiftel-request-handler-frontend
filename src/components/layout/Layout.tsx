import { ReactNode, useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prevState => !prevState);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (!isMobile) { // Only allow toggle via shortcut on desktop
                    toggleSidebar();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar, isMobile]);

    return (
        <div className={`app-layout ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
            {isSidebarOpen && isMobile && (
                <div className="mobile-overlay" onClick={toggleSidebar}></div>
            )}
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
            <div className="main-content-wrapper">
                <TopNavbar toggleSidebar={toggleSidebar} />
                <main className="main-content">
                    <div className="page-container">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
