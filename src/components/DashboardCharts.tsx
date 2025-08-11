
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmployeeStats, Stats } from '../types';

interface DashboardChartsProps {
  stats: EmployeeStats & Stats;
  role: 'employee' | 'admin' | 'board_member';
}

const COLORS = {
  approved: '#10B981', 
  pending: '#F59E0B',  
  rejected: '#EF4444', 
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent * 100 < 5) return null; // Don't render label if slice is too small

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DashboardCharts = ({ stats, role }: DashboardChartsProps) => {
  const data = role === 'employee' ? [
    { name: 'Approved', value: stats.approved, color: COLORS.approved },
    { name: 'Pending', value: stats.pending, color: COLORS.pending },
    { name: 'Rejected', value: stats.rejected, color: COLORS.rejected },
  ] : [
    { name: 'Approved', value: stats.approvedRequests, color: COLORS.approved },
    { name: 'Pending', value: stats.pendingRequests, color: COLORS.pending },
    { name: 'Rejected', value: stats.rejectedRequests, color: COLORS.rejected },
  ];

  const filteredData = data.filter(item => item.value > 0);

  if (filteredData.length === 0) {
    return null; // Don't render chart if there's no data
  }

  return (
    <div className="card chart-container-card">
        <h3>Request Status Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={filteredData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {filteredData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'Requests']} />
                <Legend iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default DashboardCharts;
