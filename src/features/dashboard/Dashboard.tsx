import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Stats, EmployeeStats } from '../../types';
import { FiArchive, FiCheckCircle, FiXCircle, FiClock, FiUsers } from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const getDashboardStats = async () => {
    const { data } = await api.get<Stats & EmployeeStats>('/requests/stats');
    return data;
};

const StatCard = ({ title, value, icon, colorClass }: { title: string, value: number, icon: React.ReactNode, colorClass: string }) => (
    <div className="card stat-card">
        <div className={`stat-card-icon ${colorClass}`}>
            {icon}
        </div>
        <div className="stat-card-info">
            <h4>{title}</h4>
            <p>{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: getDashboardStats,
    });

    const employeePieData = stats ? [
        { name: 'Approved', value: stats.approved || 0 },
        { name: 'Rejected', value: stats.rejected || 0 },
        { name: 'Pending', value: stats.pending || 0 },
    ] : [];

    const adminBarData = stats ? [
        { name: 'Pending', value: stats.pendingRequests || 0 },
        { name: 'Approved', value: stats.approvedRequests || 0 },
        { name: 'Rejected', value: stats.rejectedRequests || 0 },
    ] : [];

    const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

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
                    <div className="dashboard-grid">
                        {user?.role === 'employee' ? (
                            <>
                                <StatCard title="Total Requests" value={stats.totalRequests} icon={<FiArchive />} colorClass="primary" />
                                <StatCard title="Approved" value={stats.approved} icon={<FiCheckCircle />} colorClass="success" />
                                <StatCard title="Rejected" value={stats.rejected} icon={<FiXCircle />} colorClass="danger" />
                                <StatCard title="Pending" value={stats.pending} icon={<FiClock />} colorClass="warning" />
                            </>
                        ) : (
                            <>
                                <StatCard title="Total Requests" value={stats.totalRequests} icon={<FiArchive />} colorClass="primary" />
                                <StatCard title="Pending Requests" value={stats.pendingRequests} icon={<FiClock />} colorClass="warning" />
                                <StatCard title="Total Employees" value={stats.totalEmployees} icon={<FiUsers />} colorClass="gray" />
                            </>
                        )}
                    </div>
                    <div className="dashboard-charts">
                        {user?.role === 'employee' && stats.totalRequests > 0 && (
                            <div className="card chart-card">
                                <h3>My Request Statuses</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={employeePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                            {employeePieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                         {(user?.role === 'admin' || user?.role === 'board_member') && stats.totalRequests > 0 && (
                            <div className="card chart-card">
                                <h3>Overall Request Statuses</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={adminBarData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="var(--primary-color)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;