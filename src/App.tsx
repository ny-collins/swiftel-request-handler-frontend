import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import TopNavbar from './components/layout/TopNavbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MakeRequest from './pages/MakeRequest';
import ViewRequests from './pages/ViewRequests';
import RequestDetails from './pages/RequestDetails';
import Users from './pages/Users';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import NotificationCenter from './pages/NotificationCenter';
import { useWebSocket } from './hooks/useWebSocket';
import FullScreenLoader from './components/ui/FullScreenLoader';

type ScreenSize = 'small' | 'medium' | 'large';

function getScreenSize(): ScreenSize {
    if (window.innerWidth < 768) return 'small';
    if (window.innerWidth < 1024) return 'medium';
    return 'large';
}

function App() {
    useWebSocket();
    const { user, isLoading } = useAuth();
    const [screenSize, setScreenSize] = useState<ScreenSize>(getScreenSize());
    const [isSidebarOpen, setIsSidebarOpen] = useState(getScreenSize() !== 'small');

    const handleResize = useCallback(() => {
        setScreenSize(getScreenSize());
    }, []);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prevState => !prevState);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isSidebarOpen) {
                toggleSidebar();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSidebarOpen, toggleSidebar]);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!user) {
        return (
            <div className="auth-container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        );
    }
    
    const appContainerClasses = `app-container screen-${screenSize} ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`;

    return (
        <div className={appContainerClasses}>
            {isSidebarOpen && screenSize !== 'large' && <div className="mobile-overlay" onClick={toggleSidebar}></div>}
            <TopNavbar 
                toggleSidebar={toggleSidebar} 
                isSidebarOpen={isSidebarOpen}
                screenSize={screenSize}
            />
            <Navbar 
                isSidebarOpen={isSidebarOpen}
                screenSize={screenSize}
                toggleSidebar={toggleSidebar} // Pass the toggle function
            />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Common Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><NotificationCenter /></ProtectedRoute>} />

                    {/* Employee Routes */}
                    <Route path="/make-request" element={<ProtectedRoute roles={['employee']}><MakeRequest /></ProtectedRoute>} />
                    <Route path="/my-requests" element={<ProtectedRoute roles={['employee']}><ViewRequests /></ProtectedRoute>} />
                    
                    {/* Board & Admin Routes */}
                    <Route path="/requests" element={<ProtectedRoute roles={['admin', 'board_member']}><ViewRequests /></ProtectedRoute>} />
                    <Route path="/requests/:id" element={<ProtectedRoute roles={['admin', 'board_member']}><RequestDetails /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute roles={['admin', 'board_member']}><Users /></ProtectedRoute>} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
