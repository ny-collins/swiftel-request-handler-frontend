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

function App() {
    useWebSocket();
    const { user, isLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prevState => !prevState);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggleSidebar();
            }
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
            <div className="bg-gray-50">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 text-gray-800">
            {isSidebarOpen && window.innerWidth < 1024 && 
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            }
            <TopNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <main className={`transition-all duration-300 ease-in-out p-4 sm:p-6 lg:p-8 mt-16 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
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
