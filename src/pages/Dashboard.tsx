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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to={`${requestPath}?status=all`}><StatItem title="Total Requests" value={stats.totalRequests} icon={<FiArchive />} /></Link>
                    <Link to={`${requestPath}?status=approved`}><StatItem title="Approved" value={stats.approved} icon={<FiCheckCircle />} /></Link>
                    <Link to={`${requestPath}?status=rejected`}><StatItem title="Rejected" value={stats.rejected} icon={<FiXCircle />} /></Link>
                    <Link to={`${requestPath}?status=pending`}><StatItem title="Pending" value={stats.pending} icon={<FiClock />} /></Link>
                </div>
            );
        } else {
            const requestPath = '/requests';
            return (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to={`${requestPath}?status=all`}><StatItem title="Total Requests" value={stats.totalRequests} icon={<FiArchive />} /></Link>
                    <Link to={`${requestPath}?status=pending`}><StatItem title="Pending Review" value={stats.pendingRequests} icon={<FiClock />} /></Link>
                    <Link to="/users"><StatItem title="Total Employees" value={stats.totalEmployees} icon={<FiUsers />} /></Link>
                    <Link to={`${requestPath}?status=approved`}><StatItem title="Approved" value={stats.approvedRequests} icon={<FiCheckCircle />} /></Link>
                </div>
            );
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-500">Welcome back, {user?.username || 'Guest'}!</p>
            </div>

            {renderStats()}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {user?.role === 'employee' ? (
                        <>
                            <MyRecentRequestStatus latestRequest={latestEmployeeRequest} />
                            <QuickRequestForm />
                        </>
                    ) : (
                        <>
                            {stats && user?.role && <DashboardCharts stats={stats} role={user.role} />}
                        </>
                    )}
                </div>
                <div className="lg:col-span-1">
                    {user?.role !== 'employee' && recentPendingRequests && <RecentRequestsList requests={recentPendingRequests} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
