import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import Dashboard from '../features/dashboard/Dashboard';
import MakeRequest from '../features/requests/pages/MakeRequest';
import ViewRequests from '../features/requests/pages/ViewRequests';
import RequestDetails from '../features/requests/pages/RequestDetails';
import Users from '../features/users/Users';
import Account from '../features/account/Account';
import NotFound from '../components/layout/NotFound';
import NotificationCenter from '../features/notifications/NotificationCenter';
import { AuthProvider } from '../features/auth/AuthContext';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthProvider queryClient={queryClient}><ProtectedRoute /></AuthProvider>,
        children: [
            {
                element: <Layout />,
                children: [
                    { index: true, element: <Navigate to="/dashboard" replace /> },
                    { path: 'dashboard', element: <Dashboard /> },
                    { path: 'account', element: <Account /> },
                    { path: 'notifications', element: <NotificationCenter /> },
                    { path: 'make-request', element: <ProtectedRoute roles={['employee']}><MakeRequest /></ProtectedRoute> },
                    { path: 'my-requests', element: <ProtectedRoute roles={['employee']}><ViewRequests /></ProtectedRoute> },
                    { path: 'requests', element: <ProtectedRoute roles={['admin', 'board_member']}><ViewRequests /></ProtectedRoute> },
                    { path: 'requests/:id', element: <RequestDetails /> },
                    { path: 'users', element: <ProtectedRoute roles={['admin', 'board_member']}><Users /></ProtectedRoute> },
                ]
            }
        ]
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

export default router;