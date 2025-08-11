import { useAuth } from '../hooks/useAuth';
import api from '../api';
import StatItem from '../components/ui/StatItem';
import QuickRequestForm from '../components/QuickRequestForm';
import StatItemSkeleton from '../components/ui/StatItemSkeleton';
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

    const { data: requests } = useQuery<Request[], Error>({
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
                <div className="dashboard-stats-grid">
                    {[...Array(4)].map((_, index) => (
                        <StatItemSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (!stats) {
            return null;
        }

        if (user?.role === 'employee') {
            const requestPath = '/my-requests';
            return (
                <div className="dashboard-stats-grid">
                    <Link to={`${requestPath}?status=all`}><StatItem title="Total Requests" value={stats.totalRequests} icon={<FiArchive />} color="purple" /></Link>
                    <Link to={`${requestPath}?status=approved`}><StatItem title="Approved" value={stats.approved} icon={<FiCheckCircle />} color="green" /></Link>
                    <Link to={`${requestPath}?status=rejected`}><StatItem title="Rejected" value={stats.rejected} icon={<FiXCircle />} color="red" /></Link>
                    <Link to={`${requestPath}?status=pending`}><StatItem title="Pending" value={stats.pending} icon={<FiClock />} color="yellow" /></Link>
                </div>
            );
        } else {
            const requestPath = '/requests';
            return (
                 <div className="dashboard-stats-grid">
                    <Link to={`${requestPath}?status=all`}><StatItem title="Total Requests" value={stats.totalRequests} icon={<FiArchive />} color="purple" /></Link>
                    <Link to={`${requestPath}?status=pending`}><StatItem title="Pending Review" value={stats.pendingRequests} icon={<FiClock />} color="yellow" /></Link>
                    <Link to="/users"><StatItem title="Total Employees" value={stats.totalEmployees} icon={<FiUsers />} color="green" /></Link>
                    <Link to={`${requestPath}?status=approved`}><StatItem title="Approved" value={stats.approvedRequests} icon={<FiCheckCircle />} color="red" /></Link>
                </div>
            );
        }
    };

    return (
        <div className="space-y-8">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome back, {user?.username || 'Guest'}!</p>
            </div>

            {renderStats()}

            <div className="dashboard-main-grid">
                <div className="dashboard-col-span-2">
                    {user?.role === 'employee' ? (
                        <div className="space-y-8">
                            <MyRecentRequestStatus latestRequest={latestEmployeeRequest} />
                            <QuickRequestForm />
                        </div>
                    ) : (
                        <>
                            {stats && user?.role && <DashboardCharts stats={stats} role={user.role} />}
                        </>
                    )}
                </div>
                <div>
                    {user?.role !== 'employee' && recentPendingRequests && <RecentRequestsList requests={recentPendingRequests} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
