import { RouterProvider } from 'react-router-dom';
import router from './router';
import { AuthProvider } from './features/auth/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient();

function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider queryClient={queryClient}>
                    <RouterProvider router={router} />
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;