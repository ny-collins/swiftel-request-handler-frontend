import { useAuth } from '../hooks/useAuth';
import api from '../api';
import StatCard from '../components/ui/StatCard';
import QuickRequestForm from '../components/QuickRequestForm';
import StatCardSkeleton from '../components/ui/StatCardSkeleton';
import DashboardCharts from '../components/DashboardCharts';
import RecentRequestsList from '../components/RecentRequestsList';
import MyRecentRequestStatus from '../components/MyRecentRequestStatus';
import { Link } from 'react-router-dom';

import { FiArchive, FiCheckCircle, FiXCircle, FiClock, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { EmployeeStats, Stats, Request } from '../types';

const fetchStats = async () => {
    const { data } = await api.get('/requests/stats');
    return data;
};

const fetchRequests = async (isEmployee: boolean) => {
    const url = isEmployee ? '/requests/my-requests' : '/requests';
    const { data } = await api.get<Request[]>(url);
    return data;
};

const Dashboard = () => {
    const { user } = useAuth();
    const isEmployee = user?.role === 'employee';

    const { data: stats, error: statsError, isLoading: isLoadingStats } = useQuery<EmployeeStats & Stats, Error>({
        queryKey: ['dashboardStats'],
        queryFn: fetchStats,
    });

    const { data: requests, isLoading: isLoadingRequests } = useQuery<Request[], Error>({
        queryKey: ['requests', isEmployee],
        queryFn: () => fetchRequests(isEmployee),
        enabled: !!user, // Only fetch requests if user is loaded
    });

    if (statsError) {
        toast.error('Could not load dashboard statistics.');
    }

    const recentPendingRequests = user?.role !== 'employee' 
        ? requests?.filter(r => r.status === 'pending').slice(0, 5) 
        : [];

    const latestEmployeeRequest = user?.role === 'employee'
        ? requests?.[0]
        : undefined;

    const renderStats = () => {
        if (isLoadingStats) {
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
                {user?.role === 'employee' ? (
                    <>
                        <MyRecentRequestStatus latestRequest={latestEmployeeRequest} />
                        <QuickRequestForm />
                    </>
                ) : (
                    <>
                        {stats && user?.role && <DashboardCharts stats={stats} role={user.role} />}
                        {recentPendingRequests && <RecentRequestsList requests={recentPendingRequests} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
