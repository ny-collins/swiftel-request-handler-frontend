import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Stats, EmployeeStats } from '../../types';

const getDashboardStats = async () => {
    const { data } = await api.get<Stats & EmployeeStats>('/requests/stats');
    return data;
};

const Dashboard = () => {
    const { user } = useAuth();
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: getDashboardStats,
    });

    return (
        <>
            <div className="page-header">
                <h1>Welcome back, {user?.username}!</h1>
                <p>Here's a summary of your activity and system status.</p>
            </div>

            {isLoading && <p>Loading stats...</p>}
            {error && <p className="error-text">Could not load dashboard statistics.</p>}
            
            {stats && (
                <div className="dashboard-content">
                    {/* Stats and charts will go here */}
                </div>
            )}
        </>
    );
};

export default Dashboard;