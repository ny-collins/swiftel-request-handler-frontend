import { RouterProvider } from 'react-router-dom';
import router from './router';
import { AuthProvider } from './features/auth/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider queryClient={queryClient}>
                <RouterProvider router={router} />
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;