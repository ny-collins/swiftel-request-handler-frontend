import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useAuth } from './hooks/useAuth';
import FullScreenLoader from './components/ui/FullScreenLoader';

function App() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return <RouterProvider router={router} />;
}

export default App;
