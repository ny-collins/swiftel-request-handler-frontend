import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
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
import FullScreenLoader from './components/ui/FullScreenLoader';

function App() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
                path="/*" 
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Routes>
                                {/* Common Routes */}
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/account" element={<Account />} />
                                <Route path="/notifications" element={<NotificationCenter />} />

                                {/* Employee Routes */}
                                <Route path="/make-request" element={<ProtectedRoute roles={['employee']}><MakeRequest /></ProtectedRoute>} />
                                <Route path="/my-requests" element={<ProtectedRoute roles={['employee']}><ViewRequests /></ProtectedRoute>} />

                                {/* Board & Admin Routes */}
                                <Route path="/requests" element={<ProtectedRoute roles={['admin', 'board_member']}><ViewRequests /></ProtectedRoute>} />
                                <Route path="/requests/:id" element={<ProtectedRoute roles={['admin', 'board_member', 'employee']}><RequestDetails /></ProtectedRoute>} />
                                <Route path="/users" element={<ProtectedRoute roles={['admin', 'board_member']}><Users /></ProtectedRoute>} />

                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
