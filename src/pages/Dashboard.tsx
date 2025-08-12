import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Stats, EmployeeStats } from '../../types';
import StatItem from '../../components/ui/StatItem';
import DashboardCharts from '../../components/DashboardCharts';
import { FiUsers, FiClock, FiCheckCircle, FiXCircle, FiArchive } from 'react-icons/fi';

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

    const renderEmployeeStats = (s: EmployeeStats) => (
        <>
            <div className="grid-container">
                <StatItem title="Total Requests" value={s.totalRequests} icon={<FiArchive />} color="purple" />
                <StatItem title="Pending" value={s.pending} icon={<FiClock />} color="yellow" />
                <StatItem title="Approved" value={s.approved} icon={<FiCheckCircle />} color="green" />
                <StatItem title="Rejected" value={s.rejected} icon={<FiXCircle />} color="red" />
            </div>
            {s.totalRequests > 0 && <DashboardCharts stats={s} role="employee" />}
        </>
    );

    const renderAdminStats = (s: Stats) => (
        <>
            <div className="grid-container">
                <StatItem title="Total Requests" value={s.totalRequests} icon={<FiArchive />} color="purple" />
                <StatItem title="Pending Requests" value={s.pendingRequests} icon={<FiClock />} color="yellow" />
                <StatItem title="Total Employees" value={s.totalEmployees} icon={<FiUsers />} color="info" />
            </div>
            {s.totalRequests > 0 && <DashboardCharts stats={s} role="admin" />}
        </>
    );

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
                    {user?.role === 'employee' ? renderEmployeeStats(stats) : renderAdminStats(stats)}
                </div>
            )}
        </>
    );
};

export default Dashboard;
