import { ReactNode, useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prevState => !prevState);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggleSidebar();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    const isMobile = window.innerWidth < 1024;

    return (
        <div className={`app-layout ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
            {isSidebarOpen && isMobile && (
                <div className="mobile-overlay" onClick={toggleSidebar}></div>
            )}
            <Sidebar isSidebarOpen={isSidebarOpen} />
            <div className="main-content-wrapper">
                <TopNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;