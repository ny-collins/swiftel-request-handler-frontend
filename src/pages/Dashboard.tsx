import { useAuth } from '../hooks/useAuth';
import api from '../api';
import StatCard from '../components/ui/StatCard';
import QuickRequestForm from '../components/QuickRequestForm';
import StatCardSkeleton from '../components/ui/StatCardSkeleton';
import DashboardCharts from '../components/DashboardCharts';
import { Link } from 'react-router-dom';

import { FiArchive, FiCheckCircle, FiXCircle, FiClock, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { EmployeeStats, Stats } from '../types';

const Dashboard = () => {
    const { user } = useAuth();

    const fetchStats = async () => {
        const { data } = await api.get('/requests/stats');
        return data;
    };

    const { data: stats, error, isLoading } = useQuery<EmployeeStats & Stats, Error>({
        queryKey: ['dashboardStats'],
        queryFn: fetchStats,
    });

    if (error) {
        toast.error('Could not load dashboard statistics.');
    }

    const renderStats = () => {
        if (isLoading) {
            return (
                <div className="stats-grid">
                    {[...Array(4)].map((_, index) => (
                        <StatCardSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (!stats) {
            return <p>No dashboard statistics available.</p>;
        }

        if (user?.role === 'employee') {
            const requestPath = '/my-requests';
            return (
                <div className="stats-grid">
                    <Link to={`${requestPath}?status=all`}><StatCard title="Total Requests" value={stats.totalRequests} icon={<FiArchive />} /></Link>
                    <Link to={`${requestPath}?status=approved`}><StatCard title="Approved" value={stats.approved} icon={<FiCheckCircle />} /></Link>
                    <Link to={`${requestPath}?status=rejected`}><StatCard title="Rejected" value={stats.rejected} icon={<FiXCircle />} /></Link>
                    <Link to={`${requestPath}?status=pending`}><StatCard title="Pending" value={stats.pending} icon={<FiClock />} /></Link>
                </div>
            );
        } else {
            const requestPath = '/requests';
            return (
                 <div className="stats-grid">
                    <Link to={`${requestPath}?status=all`}><StatCard title="Total Requests" value={stats.totalRequests} icon={<FiArchive />} /></Link>
                    <Link to={`${requestPath}?status=pending`}><StatCard title="Pending Review" value={stats.pendingRequests} icon={<FiClock />} /></Link>
                    <Link to="/users"><StatCard title="Total Employees" value={stats.totalEmployees} icon={<FiUsers />} /></Link>
                    <Link to={`${requestPath}?status=approved`}><StatCard title="Approved" value={stats.approvedRequests} icon={<FiCheckCircle />} /></Link>
                </div>
            );
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome back, {user?.username || 'Guest'}!</p>
            </div>

            {renderStats()}

            <div className="dashboard-main-content">
                {stats && user?.role && <DashboardCharts stats={stats} role={user.role} />}
                {user?.role === 'employee' && <QuickRequestForm />}
            </div>
        </div>
    );
};

export default Dashboard;
