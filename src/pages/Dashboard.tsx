import { useAuth } from '../hooks/useAuth';
import api from '../api';
import StatItem from '../components/ui/StatItem';
import QuickRequestForm from '../components/QuickRequestForm';
import DashboardCharts from '../components/DashboardCharts';
import RecentRequestsList from '../components/RecentRequestsList';
import MyRecentRequestStatus from '../components/MyRecentRequestStatus';
import { Link } from 'react-router-dom';
import { FiArchive, FiCheckCircle, FiXCircle, FiClock, FiUsers, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { EmployeeStats, Stats, Request } from '../types';
import EmptyState from '../components/ui/EmptyState';
import StatItemSkeleton from '../components/ui/StatItemSkeleton';

const fetchDashboardData = async (isEmployee: boolean) => {
    const statsPromise = api.get('/requests/stats');
    const requestsUrl = isEmployee ? '/requests/my-requests' : '/requests';
    const requestsPromise = api.get<Request[]>(requestsUrl);

    const [statsRes, requestsRes] = await Promise.all([statsPromise, requestsPromise]);
    
    return {
        stats: statsRes.data,
        requests: requestsRes.data,
    };
};

const Dashboard = () => {
    const { user } = useAuth();
    const isEmployee = user?.role === 'employee';

    const { data, error, isLoading } = useQuery({
        queryKey: ['dashboardData', isEmployee],
        queryFn: () => fetchDashboardData(isEmployee),
        enabled: !!user,
    });

    if (error) {
        toast.error('Could not load dashboard data.');
    }

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="page-header-welcome">
                    <h1>Welcome back...</h1>
                    <p>Loading your dashboard...</p>
                </div>
                <div className="dashboard-stats-grid">
                    {[...Array(4)].map((_, i) => <StatItemSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <EmptyState 
                icon={<FiArchive />}
                title="No Data"
                message="Could not load dashboard information. Please try again later."
            />
        );
    }

    const { stats, requests } = data;

    const recentPendingRequests = !isEmployee
        ? requests?.filter(r => r.status === 'pending').slice(0, 5)
        : [];

    const latestEmployeeRequest = isEmployee ? requests?.[0] : undefined;

    const renderStats = () => {
        if (isEmployee) {
            const s = stats as EmployeeStats;
            const path = '/my-requests';
            return (
                <div className="dashboard-stats-grid">
                    <Link to={`${path}?status=all`}><StatItem title="Total Requests" value={s.totalRequests} icon={<FiArchive />} color="purple" /></Link>
                    <Link to={`${path}?status=approved`}><StatItem title="Approved" value={s.approved} icon={<FiCheckCircle />} color="green" /></Link>
                    <Link to={`${path}?status=rejected`}><StatItem title="Rejected" value={s.rejected} icon={<FiXCircle />} color="red" /></Link>
                    <Link to={`${path}?status=pending`}><StatItem title="Pending" value={s.pending} icon={<FiClock />} color="yellow" /></Link>
                </div>
            );
        }
        const s = stats as Stats;
        const path = '/requests';
        return (
            <div className="dashboard-stats-grid">
                <Link to={`${path}?status=all`}><StatItem title="Total Requests" value={s.totalRequests} icon={<FiArchive />} color="purple" /></Link>
                <Link to={`${path}?status=pending`}><StatItem title="Pending Review" value={s.pendingRequests} icon={<FiClock />} color="yellow" /></Link>
                <Link to="/users"><StatItem title="Total Employees" value={s.totalEmployees} icon={<FiUsers />} color="green" /></Link>
                <Link to={`${path}?status=rejected`}><StatItem title="Total Rejected" value={s.rejectedRequests} icon={<FiXCircle />} color="red" /></Link>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <div className="page-header-welcome">
                <h1>Welcome back, {user?.username}!</h1>
                <p>Here's a summary of your activity and system status.</p>
                {isEmployee && (
                    <Link to="/make-request" className="btn btn-primary">
                        <FiPlus />
                        New Request
                    </Link>
                )}
            </div>

            {renderStats()}

            <div className="dashboard-main-grid">
                <div className="dashboard-col-span-2 space-y-8">
                    {isEmployee ? (
                        <>
                            <MyRecentRequestStatus latestRequest={latestEmployeeRequest} />
                            <QuickRequestForm />
                        </>
                    ) : (
                        <DashboardCharts stats={stats} role={user!.role!} />
                    )}
                </div>
                <div className="space-y-8">
                    {!isEmployee && <RecentRequestsList requests={recentPendingRequests} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
